'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { QuarantineOrganizationList } from '@/components/business/quarantine/QuarantineOrganizationList'
import { QuarantineOrganizationStats } from '@/components/business/quarantine/QuarantineOrganizationStats'
import { QuarantineOrganizationForm } from '@/components/business/quarantine/QuarantineOrganizationForm'
import { QuarantineOrganizationExport } from '@/components/business/quarantine/QuarantineOrganizationExport'
import { useToast } from '@/components/ui/use-toast'
import type { FormValues } from '@/components/business/quarantine/QuarantineOrganizationForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function QuarantineOrganizationsPage() {
  const { toast } = useToast()
  const [formOpen, setFormOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingOrganization, setEditingOrganization] = useState<FormValues | null>(null)
  const [searchParams, setSearchParams] = useState<Record<string, any>>({})

  const handleFormSubmit = async (values: FormValues) => {
    try {
      setFormLoading(true)
      const response = await fetch('/api/quarantine-organizations', {
        method: editingOrganization ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const result = await response.json()
      if (result.code === 200) {
        toast({
          title: `${editingOrganization ? '更新' : '创建'}成功`,
          description: '机构信息已保存',
        })
        // 刷新列表
        window.location.reload()
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Failed to save organization:', error)
      toast({
        title: `${editingOrganization ? '更新' : '创建'}失败`,
        description: '请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setFormLoading(false)
      setFormOpen(false)
      setEditingOrganization(null)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="检疫机构管理"
        description="管理和查看检疫机构基本信息，跟踪机构业务数据和同步状态"
      />
      
      {/* 同步状态提醒 */}
      <Alert variant="warning" className="bg-yellow-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          上次同步时间：2024-02-13 10:00:00，发现 3 个机构数据不一致，
          <a href="#" className="font-medium hover:underline">点击查看详情</a>
        </AlertDescription>
      </Alert>
      
      {/* 数据概览 */}
      <QuarantineOrganizationStats />

      {/* 机构地图分布 */}
      <Card className="p-6">
        <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
          机构地理分布图（使用高德地图或其他地图服务）
        </div>
      </Card>

      {/* 机构列表 */}
      <Card className="p-6">
        <QuarantineOrganizationList
          onEdit={organization => {
            setEditingOrganization(organization)
            setFormOpen(true)
          }}
          onSearchParamsChange={setSearchParams}
        />
      </Card>

      {/* 机构表单 */}
      <QuarantineOrganizationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingOrganization || undefined}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      {/* 导出按钮 */}
      <QuarantineOrganizationExport
        searchParams={searchParams}
        className="fixed bottom-6 right-6"
      />
    </div>
  )
} 