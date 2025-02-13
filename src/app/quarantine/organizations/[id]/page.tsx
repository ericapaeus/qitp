'use client';

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QuarantineOrganizationInfo } from '@/components/business/quarantine/QuarantineOrganizationInfo'
import { QuarantineOrganizationStatistics } from '@/components/business/quarantine/QuarantineOrganizationStatistics'
import { QuarantineOrganizationPersonnel } from '@/components/business/quarantine/QuarantineOrganizationPersonnel'
import { QuarantineOrganizationTasks } from '@/components/business/quarantine/QuarantineOrganizationTasks'
import { QuarantineOrganizationResults } from '@/components/business/quarantine/QuarantineOrganizationResults'
import { QuarantineOrganizationCertificate } from '@/components/business/quarantine/QuarantineOrganizationCertificate'
import { QuarantineOrganizationRating } from '@/components/business/quarantine/QuarantineOrganizationRating'
import { QuarantineOrganizationSyncHistory } from '@/components/business/quarantine/QuarantineOrganizationSyncHistory'

interface QuarantineOrganizationDetailsProps {
  params: {
    id: string
  }
}

export default function QuarantineOrganizationDetails({
  params,
}: QuarantineOrganizationDetailsProps) {
  const [activeTab, setActiveTab] = useState('info')

  return (
    <div className="container py-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="info">基本信息</TabsTrigger>
          <TabsTrigger value="statistics">统计数据</TabsTrigger>
          <TabsTrigger value="personnel">人员管理</TabsTrigger>
          <TabsTrigger value="tasks">任务管理</TabsTrigger>
          <TabsTrigger value="results">检测结果</TabsTrigger>
          <TabsTrigger value="certificates">资质证书</TabsTrigger>
          <TabsTrigger value="rating">机构评级</TabsTrigger>
          <TabsTrigger value="sync">同步历史</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <QuarantineOrganizationInfo organizationId={params.id} />
        </TabsContent>
        <TabsContent value="statistics">
          <QuarantineOrganizationStatistics organizationId={params.id} />
        </TabsContent>
        <TabsContent value="personnel">
          <QuarantineOrganizationPersonnel organizationId={params.id} />
        </TabsContent>
        <TabsContent value="tasks">
          <QuarantineOrganizationTasks organizationId={params.id} />
        </TabsContent>
        <TabsContent value="results">
          <QuarantineOrganizationResults organizationId={params.id} />
        </TabsContent>
        <TabsContent value="certificates">
          <QuarantineOrganizationCertificate organizationId={params.id} />
        </TabsContent>
        <TabsContent value="rating">
          <QuarantineOrganizationRating organizationId={params.id} />
        </TabsContent>
        <TabsContent value="sync">
          <QuarantineOrganizationSyncHistory organizationId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 