'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IsolationSampleList } from '@/components/business/isolation/IsolationSampleList'
import { IsolationSampleForm } from '@/components/business/isolation/IsolationSampleForm'
import { IsolationSampleStats } from '@/components/business/isolation/IsolationSampleStats'
import { IsolationSamplePrint } from '@/components/business/isolation/IsolationSamplePrint'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function IsolationSamplesPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="样品接收管理"
        description="管理隔离试种样品的接收、登记和初步检验流程，确保样品规范入库"
      />

      {/* 待处理提醒 */}
      <Alert variant="warning" className="bg-yellow-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          当前有 3 个样品待接收，2 个样品待初检，
          <a href="#" className="font-medium hover:underline">点击查看详情</a>
        </AlertDescription>
      </Alert>

      {/* 数据概览 */}
      <IsolationSampleStats />

      {/* 主要内容区 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 样品列表 */}
        <Card className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full border-b rounded-none px-6">
              <TabsTrigger value="pending">待接收</TabsTrigger>
              <TabsTrigger value="examining">初检中</TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
              <TabsTrigger value="rejected">已退回</TabsTrigger>
            </TabsList>
            <div className="p-6">
              <IsolationSampleList
                status={activeTab}
                onRegister={() => setFormOpen(true)}
              />
            </div>
          </Tabs>
        </Card>

        {/* 标签打印和快捷操作 */}
        <Card className="p-6">
          <IsolationSamplePrint />
        </Card>
      </div>

      {/* 登记表单 */}
      <IsolationSampleForm
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </div>
  )
} 