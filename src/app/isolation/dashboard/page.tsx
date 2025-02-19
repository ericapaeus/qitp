'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, FileText, ListTodo, Plus } from 'lucide-react'
import { IsolationDashboard } from '@/components/business/isolation/IsolationDashboard'
import { PageHeader } from '@/components/shared/PageHeader'
import { useRouter } from 'next/navigation'

// 快捷操作菜单
const quickActions = [
  {
    title: '样品接收',
    icon: Plus,
    path: '/isolation/samples',
    description: '登记新的隔离试种样品'
  },
  {
    title: '预约送样',
    icon: Calendar,
    path: '/isolation/appointments',
    description: '查看和管理送样预约'
  },
  {
    title: '待办任务',
    icon: ListTodo,
    path: '/isolation/tasks',
    description: '查看待处理的任务'
  },
  {
    title: '检疫文书',
    icon: FileText,
    path: '/isolation/certificates',
    description: '管理检疫相关文书'
  }
]

// 工作提醒
const reminders = [
  {
    id: '1',
    title: '样品观察',
    time: '10:00',
    description: '温室A区域 3号样品生长状况记录'
  },
  {
    id: '2',
    title: '处理确认',
    time: '14:30',
    description: '2号温室消毒处理效果确认'
  },
  {
    id: '3',
    title: '检疫到期',
    time: '明天',
    description: 'S2024020001 样品检疫期即将到期'
  }
]

export default function IsolationWorkbench() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('monitor')

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="隔离试种工作台"
        description="集中管理隔离试种相关工作，实时监控异常情况"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* 快捷操作 */}
        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => router.push(action.path)}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 工作提醒 */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">今日工作</h3>
            <Button variant="ghost" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              查看更多
            </Button>
          </div>
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-start gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{reminder.title}</span>
                    <span className="text-sm text-gray-500">{reminder.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {reminder.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 监控面板 */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="monitor">实时监控</TabsTrigger>
              <TabsTrigger value="statistics">统计分析</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="monitor">
            <IsolationDashboard />
          </TabsContent>
          <TabsContent value="statistics">
            {/* TODO: 添加统计分析组件 */}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
} 