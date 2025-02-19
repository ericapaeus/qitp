'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { QuarantineOrganizationList } from '@/components/business/quarantine/QuarantineOrganizationList'
import { QuarantineOrganizationStats } from '@/components/business/quarantine/QuarantineOrganizationStats'
import { QuarantineOrganizationForm } from '@/components/business/quarantine/QuarantineOrganizationForm'
import { QuarantineOrganizationExport } from '@/components/business/quarantine/QuarantineOrganizationExport'
import { QuarantineOrganizationHierarchy } from '@/components/business/quarantine/QuarantineOrganizationHierarchy'
import { QuarantineOrganizationSyncRetry } from '@/components/business/quarantine/QuarantineOrganizationSyncRetry'
import { QuarantineOrganizationDataCheck } from '@/components/business/quarantine/QuarantineOrganizationDataCheck'
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

  const handleRetry = async (id: string) => {
    // 模拟重试操作
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleRetryAll = async () => {
    // 模拟批量重试操作
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  const handleDataCheck = async () => {
    // 模拟数据检查操作
    await new Promise(resolve => setTimeout(resolve, 1500))
  }

  const handleDataSync = async (ids: string[]) => {
    // 模拟数据同步操作
    await new Promise(resolve => setTimeout(resolve, 1500))
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

      {/* 机构层级和同步状态 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 机构层级关系 */}
        <Card className="lg:col-span-2">
          <QuarantineOrganizationHierarchy
            data={[
              {
                id: '1',
                code: 'QO001',
                name: '北京市检疫中心',
                level: 'PROVINCE',
                status: 'ACTIVE',
                children: [
                  {
                    id: '2',
                    code: 'QO002',
                    name: '北京市海淀区检疫站',
                    level: 'CITY',
                    status: 'ACTIVE',
                  },
                  {
                    id: '3',
                    code: 'QO003',
                    name: '北京市朝阳区检疫站',
                    level: 'CITY',
                    status: 'SUSPENDED',
                  },
                ],
              },
              // ... 更多数据
            ]}
            onSelect={(node) => console.log('Selected:', node)}
          />
        </Card>

        {/* 同步失败重试 */}
        <Card>
          <QuarantineOrganizationSyncRetry
            failures={[
              {
                id: '1',
                organizationId: '1',
                organizationName: '北京市检疫中心',
                type: 'ORGANIZATION',
                errorMessage: '网络连接超时',
                retryCount: 2,
                lastRetryTime: '2024-02-13T08:00:00Z',
                status: 'PENDING',
                createdAt: '2024-02-13T06:00:00Z',
              },
              // ... 更多数据
            ]}
            onRetry={handleRetry}
            onRetryAll={handleRetryAll}
          />
        </Card>
      </div>

      {/* 数据一致性检查 */}
      <Card>
        <QuarantineOrganizationDataCheck
          differences={[
            {
              id: '1',
              organizationId: '1',
              organizationName: '北京市检疫中心',
              type: 'ORGANIZATION',
              field: 'status',
              localValue: 'ACTIVE',
              remoteValue: 'SUSPENDED',
              checkTime: '2024-02-13T10:00:00Z',
            },
            // ... 更多数据
          ]}
          onCheck={handleDataCheck}
          onSync={handleDataSync}
        />
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