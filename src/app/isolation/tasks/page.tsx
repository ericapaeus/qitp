'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/shared/PageHeader'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Calendar, CheckCircle2, Clock, Filter, Search } from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'
import { zhCN } from 'date-fns/locale'

type TaskType = 'observation' | 'processing' | 'quarantine'
type TaskPriority = 'low' | 'normal' | 'high'

interface Task {
  id: string
  title: string
  description: string
  type: TaskType
  priority: TaskPriority
  status: 'pending' | 'completed'
  dueDate: string
  sample: {
    id: string
    name: string
  }
}

const typeConfig: Record<TaskType, { label: string; color: string }> = {
  observation: {
    label: '观察记录',
    color: 'bg-blue-500'
  },
  processing: {
    label: '处理确认',
    color: 'bg-orange-500'
  },
  quarantine: {
    label: '检疫确认',
    color: 'bg-purple-500'
  }
}

const priorityConfig: Record<TaskPriority, { label: string; color: string }> = {
  low: {
    label: '低',
    color: 'bg-gray-500'
  },
  normal: {
    label: '中',
    color: 'bg-blue-500'
  },
  high: {
    label: '高',
    color: 'bg-red-500'
  }
}

// 模拟任务数据
const tasks: Task[] = [
  {
    id: '1',
    title: '样品观察记录',
    description: '温室A区域 3号样品生长状况记录',
    type: 'observation',
    priority: 'normal',
    status: 'pending',
    dueDate: '2024-03-15T10:00:00',
    sample: {
      id: 'S2024020001',
      name: '水稻种子'
    }
  },
  {
    id: '2',
    title: '处理效果确认',
    description: '2号温室消毒处理效果确认',
    type: 'processing',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-03-15T14:30:00',
    sample: {
      id: 'S2024020002',
      name: '玉米种子'
    }
  },
  {
    id: '3',
    title: '检疫期结束确认',
    description: '样品检疫期结束，需要进行最终检查',
    type: 'quarantine',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-03-16T09:00:00',
    sample: {
      id: 'S2024020003',
      name: '小麦种子'
    }
  }
]

export default function TasksPage() {
  const [searchText, setSearchText] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | TaskType>('all')
  const [selectedPriority, setSelectedPriority] = useState<'all' | TaskPriority>('all')

  // 处理类型选择
  const handleTypeChange = (value: string) => {
    setSelectedType(value as 'all' | TaskType)
  }

  // 处理优先级选择
  const handlePriorityChange = (value: string) => {
    setSelectedPriority(value as 'all' | TaskPriority)
  }

  // 过滤任务
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchText === '' || 
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase()) ||
      task.sample.id.toLowerCase().includes(searchText.toLowerCase()) ||
      task.sample.name.toLowerCase().includes(searchText.toLowerCase())
    
    const matchesType = selectedType === 'all' || task.type === selectedType
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority

    return matchesSearch && matchesType && matchesPriority
  })

  // 格式化时间
  const formatDueDate = (date: string) => {
    const dueDate = new Date(date)
    if (isToday(dueDate)) {
      return `今天 ${format(dueDate, 'HH:mm')}`
    }
    if (isYesterday(dueDate)) {
      return `昨天 ${format(dueDate, 'HH:mm')}`
    }
    return format(dueDate, 'MM-dd HH:mm')
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="待办任务"
        description="查看和处理待办任务，按时完成工作"
      />

      {/* 搜索和筛选 */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="搜索任务..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="任务类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="observation">观察记录</SelectItem>
                <SelectItem value="processing">处理确认</SelectItem>
                <SelectItem value="quarantine">检疫确认</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={handlePriorityChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="优先级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部优先级</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="normal">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* 任务列表 */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4 pr-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <Card key={task.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={typeConfig[task.type].color}>
                        {typeConfig[task.type].label}
                      </Badge>
                      <Badge variant="secondary" className={priorityConfig[task.priority].color}>
                        {priorityConfig[task.priority].label}优先级
                      </Badge>
                      <span className="font-medium">{task.title}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>截止时间：{formatDueDate(task.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{task.description}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span>样品编号：{task.sample.id}</span>
                      <span>样品名称：{task.sample.name}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">查看详情</Button>
                    <Button size="sm">完成任务</Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              暂无待办任务
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
} 