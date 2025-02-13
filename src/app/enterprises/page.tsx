'use client'

import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { EnterpriseStats } from '@/components/business/enterprise/EnterpriseStats'
import { EnterpriseList } from '@/components/business/enterprise/EnterpriseList'
import { PageHeader } from '@/components/shared/PageHeader'

export default function EnterprisesPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="引种企业管理"
        description="管理和查看引种企业的基本信息，跟踪企业引种记录和进度"
      />
      
      <Suspense fallback={<div>加载统计数据...</div>}>
        <EnterpriseStats />
      </Suspense>

      <Card className="p-6">
        <Suspense fallback={<div>加载企业列表...</div>}>
          <EnterpriseList />
        </Suspense>
      </Card>
    </div>
  )
} 