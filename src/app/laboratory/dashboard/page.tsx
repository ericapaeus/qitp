'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Steps } from '@/components/ui/steps'
import { useQuery } from '@tanstack/react-query'
import { LoadingState } from '@/components/ui/loading-state'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Task } from '@/types/laboratory'

export default function LaboratoryDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

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

  // 计算统计数据
  const statistics = {
    pending: tasks.filter((task: Task) => task.status === 'pending').length,
    inProgress: tasks.filter((task: Task) => task.status === 'in_progress').length,
    completed: tasks.filter((task: Task) => task.status === 'completed').length,
    total: tasks.length
  }

  // 获取待处理任务
  const pendingTasks = tasks.filter((task: Task) => 
    task.status === 'pending' || task.status === 'in_progress'
  )

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
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
        title="实验室检验工作台"
        description="管理和追踪实验室检验任务，记录检验结果"
      />

      {/* 流程指引 */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">检验工作流程</h3>
        <Steps
          items={[
            {
              title: '任务分配',
              description: '分配检验任务给相关检验员',
              status: 'process'
            },
            {
              title: '检验记录',
              description: '记录检验方法、发现和结论',
              status: 'wait'
            },
            {
              title: '结果审核',
              description: '审核检验结果，确认或驳回',
              status: 'wait'
            },
            {
              title: '报告生成',
              description: '生成检验报告，完成流程',
              status: 'wait'
            }
          ]}
        />
      </Card>

      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">待检验</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-semibold text-yellow-500">
                {statistics.pending}
              </span>
              <span className="text-sm text-gray-500">项</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">检验中</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-semibold text-blue-500">
                {statistics.inProgress}
              </span>
              <span className="text-sm text-gray-500">项</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">已完成</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-semibold text-green-500">
                {statistics.completed}
              </span>
              <span className="text-sm text-gray-500">项</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">完成率</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-semibold">
                {Math.round((statistics.completed / statistics.total) * 100)}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="overview">待处理任务</TabsTrigger>
              <TabsTrigger value="history">检验记录</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-4">
                {isLoading ? (
                  <LoadingState text="正在加载任务列表..." />
                ) : pendingTasks.length > 0 ? (
                  pendingTasks.map((task: Task) => (
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
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {task.status === 'pending' && (
                            <Button size="sm">开始检验</Button>
                          )}
                          {task.status === 'in_progress' && (
                            <Button size="sm">继续检验</Button>
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
                    暂无待处理任务
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history">
            <div className="text-center text-gray-500 py-8">
              检验记录功能开发中...
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
} 