'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Bell, CheckCircle2, Filter, MoreVertical, Search, Settings } from 'lucide-react'
import { useAlerts } from '@/hooks/isolation/useAlerts'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { AlertSettings } from './AlertSettings'

const levelConfig = {
  info: {
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-200',
    label: '提示'
  },
  warning: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-200',
    label: '警告'
  },
  error: {
    color: 'bg-red-500',
    textColor: 'text-red-500',
    borderColor: 'border-red-200',
    label: '错误'
  }
}

export function AlertNotification() {
  const [searchText, setSearchText] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [showDetails, setShowDetails] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<{
    id: string
    title: string
    description: string
    time: string
    timestamp: string
    level: 'info' | 'warning' | 'error'
    isRead: boolean
  } | null>(null)

  const {
    alerts,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead
  } = useAlerts()

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          加载告警数据失败：{error.message}
        </AlertDescription>
      </Alert>
    )
  }

  // 过滤和搜索
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = searchText === '' || 
      alert.title.toLowerCase().includes(searchText.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchText.toLowerCase())
    
    const matchesLevel = selectedLevel === 'all' || alert.level === selectedLevel

    return matchesSearch && matchesLevel
  })

  // 格式化时间
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'MM-dd HH:mm:ss')
  }

  // 格式化相对时间
  const formatRelativeTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: zhCN
    })
  }

  return (
    <div className="space-y-4">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="font-medium">告警通知</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => markAllAsRead()}
            >
              全部已读
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowSettings(true)}>
                告警设置
              </DropdownMenuItem>
              <DropdownMenuItem>
                导出告警记录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="搜索告警..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="级别" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部级别</SelectItem>
            <SelectItem value="info">提示</SelectItem>
            <SelectItem value="warning">警告</SelectItem>
            <SelectItem value="error">错误</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 告警列表 */}
      <ScrollArea className="h-[300px]">
        <div className="space-y-3 pr-4">
          {isLoading ? (
            <>
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </>
          ) : filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onMarkAsRead={() => markAsRead(alert.id)}
                formatTime={formatTime}
                formatRelativeTime={formatRelativeTime}
                onClick={() => {
                  setSelectedAlert(alert)
                  setShowDetails(true)
                }}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              暂无告警信息
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 详情对话框 */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>告警详情</DialogTitle>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={levelConfig[selectedAlert.level].color}
                >
                  {levelConfig[selectedAlert.level].label}
                </Badge>
                {!selectedAlert.isRead && (
                  <Badge variant="secondary" className="bg-red-500">
                    未读
                  </Badge>
                )}
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">{selectedAlert.title}</h3>
                <p className="text-gray-500">{selectedAlert.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div>
                  发生时间：{formatTime(selectedAlert.timestamp)}
                </div>
                <div>
                  {formatRelativeTime(selectedAlert.timestamp)}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {!selectedAlert.isRead && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      markAsRead(selectedAlert.id)
                      setShowDetails(false)
                    }}
                  >
                    标记为已读
                  </Button>
                )}
                <Button onClick={() => setShowDetails(false)}>
                  关闭
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 告警设置对话框 */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>告警设置</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <AlertSettings />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AlertCard({ 
  alert,
  onMarkAsRead,
  formatTime,
  formatRelativeTime,
  onClick
}: { 
  alert: {
    id: string
    title: string
    description: string
    time: string
    timestamp: string
    level: 'info' | 'warning' | 'error'
    isRead: boolean
  }
  onMarkAsRead: () => void
  formatTime: (timestamp: string) => string
  formatRelativeTime: (timestamp: string) => string
  onClick: () => void
}) {
  const config = levelConfig[alert.level]

  return (
    <Card 
      className={`
        p-4 border-l-4 ${config.borderColor}
        ${alert.isRead ? 'bg-gray-50' : 'bg-white'}
        cursor-pointer hover:bg-gray-50 transition-colors
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge 
              variant="secondary" 
              className={`${config.color} text-white`}
            >
              {config.label}
            </Badge>
            <span className="text-sm text-gray-500">{formatTime(alert.timestamp)}</span>
            <span className="text-sm text-gray-400">({formatRelativeTime(alert.timestamp)})</span>
          </div>
          <h4 className="font-medium mb-1">{alert.title}</h4>
          <p className="text-sm text-gray-500">{alert.description}</p>
        </div>
        {!alert.isRead && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onMarkAsRead()
            }}
            className={config.textColor}
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
} 