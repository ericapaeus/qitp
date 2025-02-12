'use client'

import { Card } from '@/components/ui/card'

export default function ImportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">引种记录</h2>
      </div>
      <Card>
        <div className="p-6">引种记录列表</div>
      </Card>
    </div>
  )
} 