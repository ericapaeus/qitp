'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PlusIcon } from '@radix-ui/react-icons'
import { formatDate } from '@/lib/utils'

const PAGE_SIZE = 10

export default function QuarantineOrganizationsPage() {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['quarantine-organizations', { page, keyword }],
    queryFn: () => {
      // TODO: 实现获取检疫机构列表的 API
      return {
        items: [],
        total: 0
      }
    },
  })

  return (
    <div className="space-y-4">
      <PageHeader
        title="检疫机构"
        description="管理检疫机构信息"
        action={
          <Button className="gap-2">
            <PlusIcon className="h-4 w-4" />
            新增机构
          </Button>
        }
      />

      <div className="flex gap-4">
        <Input
          placeholder="搜索机构名称或代码"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>机构代码</TableHead>
              <TableHead>机构名称</TableHead>
              <TableHead>联系人</TableHead>
              <TableHead>联系电话</TableHead>
              <TableHead>地址</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : !data?.items?.length ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((org: any) => (
                <TableRow key={org.id}>
                  <TableCell>{org.code}</TableCell>
                  <TableCell>{org.name}</TableCell>
                  <TableCell>{org.contact.person}</TableCell>
                  <TableCell>{org.contact.phone}</TableCell>
                  <TableCell>{org.contact.address}</TableCell>
                  <TableCell>
                    <Badge
                      variant={org.status === 'ACTIVE' ? 'default' : 'secondary'}
                    >
                      {org.status === 'ACTIVE' ? '正常' : '已停用'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(org.updatedAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: 实现状态更新
                      }}
                    >
                      {org.status === 'ACTIVE' ? '停用' : '启用'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data?.total && data.total > PAGE_SIZE && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page * PAGE_SIZE >= data.total}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  )
} 