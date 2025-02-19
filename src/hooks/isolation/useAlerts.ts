import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Alert {
  id: string
  title: string
  description: string
  time: string
  timestamp: string
  level: 'info' | 'warning' | 'error'
  isRead: boolean
}

async function fetchAlerts(): Promise<Alert[]> {
  const response = await fetch('/api/isolation/alerts')
  if (!response.ok) {
    throw new Error('Failed to fetch alerts')
  }
  return response.json()
}

async function markAlertAsRead(id: string): Promise<void> {
  const response = await fetch(`/api/isolation/alerts/${id}/read`, {
    method: 'PATCH'
  })
  if (!response.ok) {
    throw new Error('Failed to mark alert as read')
  }
}

async function markAllAlertsAsRead(): Promise<void> {
  const response = await fetch('/api/isolation/alerts/read-all', {
    method: 'PATCH'
  })
  if (!response.ok) {
    throw new Error('Failed to mark all alerts as read')
  }
}

export function useAlerts() {
  const queryClient = useQueryClient()

  // 获取告警数据
  const { 
    data: alerts = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 10000 // 10秒更新一次
  })

  // 标记单个告警为已读
  const { mutate: markAsRead } = useMutation({
    mutationFn: markAlertAsRead,
    onSuccess: (_, id) => {
      queryClient.setQueryData(['alerts'], (old: Alert[] | undefined) => {
        if (!old) return old
        return old.map(alert => 
          alert.id === id ? { ...alert, isRead: true } : alert
        )
      })
    }
  })

  // 标记所有告警为已读
  const { mutate: markAllAsRead } = useMutation({
    mutationFn: markAllAlertsAsRead,
    onSuccess: () => {
      queryClient.setQueryData(['alerts'], (old: Alert[] | undefined) => {
        if (!old) return old
        return old.map(alert => ({ ...alert, isRead: true }))
      })
    }
  })

  const unreadCount = alerts.filter(alert => !alert.isRead).length

  return {
    alerts,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead
  }
} 