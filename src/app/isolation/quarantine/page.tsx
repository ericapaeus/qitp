'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IsolationQuarantineList } from '@/components/business/isolation/IsolationQuarantineList'
import { IsolationQuarantineStats } from '@/components/business/isolation/IsolationQuarantineStats'
import { IsolationQuarantineProcess } from '@/components/business/isolation/IsolationQuarantineProcess'
import { IsolationQuarantineReport } from '@/components/business/isolation/IsolationQuarantineReport'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function IsolationQuarantinePage() {
  const [activeTab, setActiveTab] = useState('pending')

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="检疫处理管理"
        description="管理隔离试种的检疫处理流程，记录检疫结果和处理措施"
      />

      {/* 待处理提醒 */}
      <Alert variant="warning" className="bg-yellow-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          当前有 3 个样品待检疫处理，2 个样品需要复检，1 个样品需要特殊处理，
          <a href="#" className="font-medium hover:underline">点击查看详情</a>
        </AlertDescription>
      </Alert>

      {/* 数据概览 */}
      <IsolationQuarantineStats />

      {/* 主要内容区 */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* 检疫列表 */}
        <Card className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full border-b rounded-none px-6">
              <TabsTrigger value="pending">待处理</TabsTrigger>
              <TabsTrigger value="processing">处理中</TabsTrigger>
              <TabsTrigger value="recheck">待复检</TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
            </TabsList>
            <div className="p-6">
              <IsolationQuarantineList
                status={activeTab}
              />
            </div>
          </Tabs>
        </Card>

        {/* 处理流程和报告生成 */}
        <div className="space-y-6">
          {/* 处理流程 */}
          <Card className="p-6">
            <IsolationQuarantineProcess />
          </Card>

          {/* 报告生成 */}
          <Card className="p-6">
            <IsolationQuarantineReport />
          </Card>
        </div>
      </div>
    </div>
  )
} 