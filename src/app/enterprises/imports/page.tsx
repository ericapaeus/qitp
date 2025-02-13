'use client'

import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { ImportRecordList } from '@/components/business/enterprise/ImportRecordList'
import { ImportRecordStats } from '@/components/business/enterprise/ImportRecordStats'

export default function ImportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="引种记录管理"
        description="管理和跟踪企业引种记录，实时掌握引种进度"
      />
      
      <Suspense fallback={<div>加载统计数据...</div>}>
        <ImportRecordStats />
      </Suspense>

      <Card className="p-6">
        <Suspense fallback={<div>加载引种记录...</div>}>
          <ImportRecordList />
        </Suspense>
      </Card>
    </div>
  )
} 