import { useQuery } from '@tanstack/react-query'

interface TimelineItem {
  id: string
  time: string
  timestamp: string
  title: string
  description: string
  status: 'normal' | 'warning' | 'success'
  type: 'sample' | 'environment' | 'inspection' | 'processing'
}

async function fetchTimeline(filter: string): Promise<TimelineItem[]> {
  const response = await fetch(`/api/isolation/timeline?filter=${filter}`)
  if (!response.ok) {
    throw new Error('Failed to fetch timeline')
  }
  return response.json()
}

export function useTimeline(filter: string = 'all') {
  const { 
    data: items = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['timeline', filter],
    queryFn: () => fetchTimeline(filter),
    refetchInterval: 30000 // 30秒更新一次
  })

  return {
    items,
    isLoading,
    error
  }
} 