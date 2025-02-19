'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/common/PageHeader'
import { EnterpriseInfo } from '@/components/enterprises/EnterpriseInfo'
import { EnterpriseImports } from '@/components/enterprises/EnterpriseImports'
import { EnterpriseMap } from '@/components/enterprises/EnterpriseMap'
import { getEnterprise } from '@/lib/api/enterprises'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, DownloadIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

export default function EnterprisePage() {
  const { id } = useParams()
  const { data: enterprise, isLoading } = useQuery({
    queryKey: ['enterprise', id],
    queryFn: () => getEnterprise(id as string),
    enabled: !!id,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!enterprise) {
    return <div>企业不存在</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={enterprise.name}
        description={`企业代码：${enterprise.code}`}
        action={
          <div className="flex gap-2">
            <Link href="/enterprises">
              <Button variant="outline" className="gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                返回列表
              </Button>
            </Link>
            <Button className="gap-2">
              <DownloadIcon className="h-4 w-4" />
              导出数据
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">基本信息</TabsTrigger>
          <TabsTrigger value="imports">引种记录</TabsTrigger>
          <TabsTrigger value="stats">数据统计</TabsTrigger>
          <TabsTrigger value="map">地理分布</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <EnterpriseInfo enterprise={enterprise} />
        </TabsContent>

        <TabsContent value="imports" className="space-y-4">
          <EnterpriseImports enterpriseId={enterprise.id} />
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <EnterpriseMap enterprise={enterprise} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 