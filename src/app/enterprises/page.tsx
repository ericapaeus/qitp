'use client'

import { Suspense } from 'react'
import { EnterpriseList } from '@/components/enterprises/EnterpriseList'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { UpdateIcon } from '@radix-ui/react-icons'
import { useToast } from '@/components/ui/use-toast'
import { syncEnterprises } from '@/lib/api/enterprises'

export default function EnterprisesPage() {
  const { toast } = useToast()

  const handleSync = async () => {
    try {
      const result = await syncEnterprises()
      toast({
        title: '同步成功',
        description: `成功同步 ${result.syncCount} 条企业数据`,
      })
    } catch (error) {
      toast({
        title: '同步失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="企业管理"
        description="管理企业信息，查看企业导入记录"
        action={
          <Button onClick={handleSync} className="gap-2">
            <UpdateIcon className="h-4 w-4" />
            同步企业数据
          </Button>
        }
      />
      <Suspense fallback={<div>Loading...</div>}>
        <EnterpriseList />
      </Suspense>
    </div>
  )
} 