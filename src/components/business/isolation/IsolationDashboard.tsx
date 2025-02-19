'use client'

import { Card } from '@/components/ui/card'
import { EnvironmentMonitor } from './EnvironmentMonitor'
import { ProcessTimeline } from './ProcessTimeline'
import { AlertNotification } from './AlertNotification'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function IsolationDashboard() {
  return (
    <div className="grid gap-6">
      {/* 第一行：环境监控和告警 */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 p-6">
          <h3 className="text-lg font-semibold mb-4">环境监控</h3>
          <EnvironmentMonitor />
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">实时告警</h3>
          <AlertNotification />
        </Card>
      </div>

      {/* 第二行：进度时间线 */}
      <Card className="p-6">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">进度监控</h3>
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="warning">异常</TabsTrigger>
              <TabsTrigger value="today">今日</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all">
            <ProcessTimeline filter="all" />
          </TabsContent>
          <TabsContent value="warning">
            <ProcessTimeline filter="warning" />
          </TabsContent>
          <TabsContent value="today">
            <ProcessTimeline filter="today" />
          </TabsContent>
        </Tabs>
      </Card>

      {/* 第三行：统计卡片 */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="在试样品"
          value="23"
          trend="+2"
          trendType="up"
        />
        <StatCard
          title="异常数量"
          value="3"
          trend="+1"
          trendType="up"
          status="warning"
        />
        <StatCard
          title="待处理"
          value="5"
          trend="-2"
          trendType="down"
        />
        <StatCard
          title="完成率"
          value="92%"
          trend="+5%"
          trendType="up"
          status="success"
        />
      </div>
    </div>
  )
}

// 统计卡片组件
function StatCard({
  title,
  value,
  trend,
  trendType,
  status
}: {
  title: string
  value: string
  trend: string
  trendType: 'up' | 'down'
  status?: 'success' | 'warning'
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{title}</span>
        <div className="flex items-end gap-2 mt-2">
          <span className="text-2xl font-semibold">{value}</span>
          <span className={`text-sm ${
            trendType === 'up' 
              ? 'text-green-500' 
              : 'text-red-500'
          }`}>
            {trend}
          </span>
        </div>
      </div>
    </Card>
  )
} 