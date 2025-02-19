'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Clock, AlertTriangle, HelpCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { AssignInspectorDialog } from '@/components/business/laboratory/AssignInspectorDialog'
import { InspectionDialog } from '@/components/business/laboratory/InspectionDialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoadingState } from '@/components/ui/loading-state'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import type { Task } from '@/types/laboratory'

export default function TasksPage() {
  const queryClient = useQueryClient()
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // 获取任务列表
  const { 
    data: tasks = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['laboratory', 'tasks'],
    queryFn: async () => {
      const response = await fetch('/api/laboratory/tasks')
      if (!response.ok) {
        throw new Error('获取任务列表失败')
      }
      return response.json()
    }
  })

  // 分配任务
  const { mutate: assignTask, isPending: isAssigning } = useMutation({
    mutationFn: async ({ 
      taskId, 
      data 
    }: { 
      taskId: string
      data: { inspectorId: string; remarks?: string }
    }) => {
      const response = await fetch(`/api/laboratory/tasks/${taskId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        throw new Error('分配任务失败')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratory', 'tasks'] })
      toast({
        title: '分配成功',
        description: '任务已成功分配给检验员'
      })
      setAssignDialogOpen(false)
    },
    onError: (error) => {
      toast({
        title: '分配失败',
        description: error instanceof Error ? error.message : '操作过程中发生错误',
        variant: 'destructive'
      })
    }
  })

  // 提交检验结果
  const { mutate: submitInspection, isPending: isSubmitting } = useMutation({
    mutationFn: async ({ 
      taskId, 
      data 
    }: { 
      taskId: string
      data: {
        method: string
        findings: Array<{
          id: string
          type: string
          description: string
        }>
        conclusion: 'PASS' | 'FAIL' | 'NEED_PROCESS'
        remarks?: string
        attachments?: File[]
      }
    }) => {
      const response = await fetch(`/api/laboratory/tasks/${taskId}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        throw new Error('提交检验结果失败')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratory', 'tasks'] })
      toast({
        title: '提交成功',
        description: '检验结果已成功提交'
      })
      setInspectionDialogOpen(false)
    },
    onError: (error) => {
      toast({
        title: '提交失败',
        description: error instanceof Error ? error.message : '操作过程中发生错误',
        variant: 'destructive'
      })
    }
  })

  // 处理任务分配
  const handleAssign = (taskId: string, data: { inspectorId: string; remarks?: string }) => {
    assignTask({ taskId, data })
  }

  // 处理检验结果提交
  const handleInspectionSubmit = (data: {
    method: string
    findings: Array<{
      id: string
      type: string
      description: string
    }>
    conclusion: 'PASS' | 'FAIL' | 'NEED_PROCESS'
    remarks?: string
    attachments?: File[]
  }) => {
    if (!selectedTask) return
    submitInspection({ taskId: selectedTask.id, data })
  }

  // 过滤任务
  const filteredTasks = tasks.filter((task: Task) => {
    const matchesSearch = searchText === '' || 
      task.registrationNo.toLowerCase().includes(searchText.toLowerCase()) ||
      task.plantName.toLowerCase().includes(searchText.toLowerCase()) ||
      task.symptom.toLowerCase().includes(searchText.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : '加载数据时发生错误'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="检验任务管理"
        description="管理和分配实验室检验任务，跟踪任务进度"
      />

      {/* 操作提示 */}
      <Alert>
        <HelpCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div>任务处理流程：</div>
            <ul className="list-decimal list-inside space-y-1">
              <li>分配任务给相关检验员</li>
              <li>检验员进行检验并记录结果</li>
              <li>提交检验结果等待审核</li>
            </ul>
            <div className="text-sm text-muted-foreground mt-2">
              提示：
              <ul className="list-disc list-inside mt-1">
                <li>优先处理高优先级任务</li>
                <li>可以通过筛选和搜索快速定位任务</li>
                <li>检验过程中可以随时保存草稿</li>
              </ul>
            </div>
          </div>
        </AlertDescription>
      </Alert>

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
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待检验</SelectItem>
                <SelectItem value="in_progress">检验中</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="优先级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部优先级</SelectItem>
                <SelectItem value="high">紧急</SelectItem>
                <SelectItem value="normal">普通</SelectItem>
                <SelectItem value="low">低优先级</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* 任务列表 */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4 pr-4">
          {isLoading ? (
            <LoadingState text="正在加载任务列表..." />
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task: Task) => (
              <Card key={task.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          task.priority === 'high'
                            ? 'bg-red-500 text-white'
                            : task.priority === 'normal'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-500 text-white'
                        }
                      >
                        {task.priority === 'high'
                          ? '紧急'
                          : task.priority === 'normal'
                          ? '普通'
                          : '低优先级'}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={
                          task.status === 'pending'
                            ? 'bg-yellow-500 text-white'
                            : task.status === 'in_progress'
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white'
                        }
                      >
                        {task.status === 'pending'
                          ? '待检验'
                          : task.status === 'in_progress'
                          ? '检验中'
                          : '已完成'}
                      </Badge>
                      <span className="font-medium">
                        登记号：{task.registrationNo}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <AlertTriangle className="h-4 w-4" />
                        <span>可疑症状：{task.symptom}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>
                          采样时间：
                          {format(new Date(task.samplingDate), 'yyyy-MM-dd HH:mm')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>植物名称：{task.plantName}</span>
                        <span>
                          检验员：{task.inspector ? task.inspector.name : '未分配'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {task.status === 'pending' && !task.inspector && (
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedTask(task)
                          setAssignDialogOpen(true)
                        }}
                      >
                        分配检验员
                      </Button>
                    )}
                    {task.status === 'pending' && task.inspector && (
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedTask(task)
                          setInspectionDialogOpen(true)
                        }}
                      >
                        开始检验
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedTask(task)
                          setInspectionDialogOpen(true)
                        }}
                      >
                        继续检验
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      查看详情
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 py-12">
              暂无检验任务
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 分配对话框 */}
      {selectedTask && (
        <AssignInspectorDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          task={selectedTask}
          onAssign={handleAssign}
          isSubmitting={isAssigning}
        />
      )}

      {/* 检验对话框 */}
      {selectedTask && (
        <InspectionDialog
          open={inspectionDialogOpen}
          onOpenChange={setInspectionDialogOpen}
          task={selectedTask}
          onSubmit={handleInspectionSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
} 