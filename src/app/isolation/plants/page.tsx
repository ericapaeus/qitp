'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IsolationPlantList } from '@/components/business/isolation/IsolationPlantList'
import { IsolationPlantStats } from '@/components/business/isolation/IsolationPlantStats'
import { IsolationPlantMonitor } from '@/components/business/isolation/IsolationPlantMonitor'
import { IsolationPlantRecord } from '@/components/business/isolation/IsolationPlantRecord'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function IsolationPlantsPage() {
  const [activeTab, setActiveTab] = useState('ongoing')

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="隔离试种管理"
        description="监控和记录隔离试种过程，确保试种安全规范进行"
      />

      {/* 异常提醒 */}
      <Alert variant="warning" className="bg-yellow-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          当前有 2 个试种样品生长异常，1 个样品需要定期观察，
          <a href="#" className="font-medium hover:underline">点击查看详情</a>
        </AlertDescription>
      </Alert>

      {/* 数据概览 */}
      <IsolationPlantStats />

      {/* 主要内容区 */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* 试种列表和记录 */}
        <Card className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full border-b rounded-none px-6">
              <TabsTrigger value="ongoing">试种中</TabsTrigger>
              <TabsTrigger value="observation">观察期</TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
              <TabsTrigger value="abnormal">异常</TabsTrigger>
            </TabsList>
            <div className="p-6">
              <IsolationPlantList
                status={activeTab}
              />
            </div>
          </Tabs>
        </Card>

        {/* 实时监控和快捷操作 */}
        <div className="space-y-6">
          {/* 环境监控 */}
          <Card className="p-6">
            <IsolationPlantMonitor />
          </Card>

          {/* 记录快捷操作 */}
          <Card className="p-6">
            <IsolationPlantRecord />
          </Card>
        </div>
      </div>
    </div>
  )
} 