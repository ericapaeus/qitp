'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTimeline } from '@/hooks/isolation/useTimeline'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Calendar, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const typeConfig = {
  sample: {
    label: '样品',
    color: 'bg-blue-500'
  },
  environment: {
    label: '环境',
    color: 'bg-green-500'
  },
  inspection: {
    label: '检查',
    color: 'bg-purple-500'
  },
  processing: {
    label: '处理',
    color: 'bg-orange-500'
  }
}

const statusConfig = {
  normal: {
    color: 'bg-gray-500'
  },
  warning: {
    color: 'bg-yellow-500'
  },
  success: {
    color: 'bg-green-500'
  }
}

export function ProcessTimeline({ filter = 'all' }: { filter?: string }) {
  const [searchText, setSearchText] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showDetails, setShowDetails] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{
    id: string
    time: string
    timestamp: string
    title: string
    description: string
    status: 'normal' | 'warning' | 'success'
    type: 'sample' | 'environment' | 'inspection' | 'processing'
  } | null>(null)
  
  const { items, isLoading, error } = useTimeline(filter)

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          加载进度数据失败：{error.message}
        </AlertDescription>
      </Alert>
    )
  }

  // 过滤和搜索
  const filteredItems = items.filter(item => {
    const matchesSearch = searchText === '' || 
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
    
    const matchesType = selectedType === 'all' || item.type === selectedType
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    if (isToday(date)) {
      return `今天 ${format(date, 'HH:mm')}`
    }
    if (isYesterday(date)) {
      return `昨天 ${format(date, 'HH:mm')}`
    }
    return format(date, 'MM-dd HH:mm')
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
      {/* 搜索和筛选 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="搜索进度记录..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              {Object.entries(typeConfig).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="normal">正常</SelectItem>
              <SelectItem value="warning">异常</SelectItem>
              <SelectItem value="success">完成</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 时间线列表 */}
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <TimelineCard 
                key={item.id} 
                item={item} 
                isLast={index === filteredItems.length - 1}
                formatTime={formatTime}
                formatRelativeTime={formatRelativeTime}
                onClick={() => {
                  setSelectedItem(item)
                  setShowDetails(true)
                }}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              暂无进度记录
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 详情对话框 */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>进度详情</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={typeConfig[selectedItem.type].color}>
                  {typeConfig[selectedItem.type].label}
                </Badge>
                <Badge variant="secondary" className={statusConfig[selectedItem.status].color}>
                  {selectedItem.status === 'normal' ? '正常' : 
                   selectedItem.status === 'warning' ? '异常' : '完成'}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">{selectedItem.title}</h3>
                <p className="text-gray-500">{selectedItem.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatTime(selectedItem.timestamp)}
                </div>
                <div>
                  {formatRelativeTime(selectedItem.timestamp)}
                </div>
              </div>
              {/* 这里可以添加更多详细信息 */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TimelineCard({ 
  item, 
  isLast,
  formatTime,
  formatRelativeTime,
  onClick
}: { 
  item: {
    id: string
    time: string
    timestamp: string
    title: string
    description: string
    status: 'normal' | 'warning' | 'success'
    type: 'sample' | 'environment' | 'inspection' | 'processing'
  }
  isLast: boolean
  formatTime: (timestamp: string) => string
  formatRelativeTime: (timestamp: string) => string
  onClick: () => void
}) {
  const type = typeConfig[item.type]
  const status = statusConfig[item.status]

  return (
    <div className="relative">
      {/* 连接线 */}
      {!isLast && (
        <div 
          className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200"
          style={{ top: '24px' }}
        />
      )}

      <Card 
        className="relative flex items-start p-4 gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onClick}
      >
        {/* 时间点 */}
        <div className={`w-6 h-6 rounded-full ${status.color} flex-shrink-0 mt-1`} />

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className={type.color}>
              {type.label}
            </Badge>
            <span className="text-sm text-gray-500">{formatTime(item.timestamp)}</span>
            <span className="text-sm text-gray-400">({formatRelativeTime(item.timestamp)})</span>
          </div>
          <h4 className="font-medium mb-1">{item.title}</h4>
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>
      </Card>
    </div>
  )
} 