'use client'

import { Suspense } from 'react'
import { ImportRecordList } from '@/components/enterprises/ImportRecordList'
import { PageHeader } from '@/components/common/PageHeader'

export default function ImportsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="引种记录"
        description="查看和管理企业引种记录"
      />
      <Suspense fallback={<div>Loading...</div>}>
        <ImportRecordList />
      </Suspense>
    </div>
  )
} 