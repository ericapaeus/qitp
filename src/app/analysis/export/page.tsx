'use client'

import { Card } from '@/components/ui/card'

export default function ExportPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">数据导出</h2>
      </div>
      <Card>
        <div className="p-6">数据导出选项</div>
      </Card>
    </div>
  )
} 