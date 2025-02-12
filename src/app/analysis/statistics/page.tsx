'use client'

import { Card } from '@/components/ui/card'

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">统计报表</h2>
      </div>
      <Card>
        <div className="p-6">统计报表内容</div>
      </Card>
    </div>
  )
} 