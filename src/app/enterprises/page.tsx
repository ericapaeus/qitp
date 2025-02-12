'use client'

import { Card } from '@/components/ui/card'

export default function EnterprisesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">企业信息</h2>
      </div>
      <Card>
        <div className="p-6">企业信息列表</div>
      </Card>
    </div>
  )
} 