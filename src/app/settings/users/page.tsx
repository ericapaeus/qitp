'use client'

import { Card } from '@/components/ui/card'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">用户管理</h2>
      </div>
      <Card>
        <div className="p-6">用户列表</div>
      </Card>
    </div>
  )
} 