'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { getEnterprises, updateEnterpriseStatus } from '@/lib/api/enterprises'
import type { Enterprise } from '@/types/api/enterprises'
import { formatDate } from '@/lib/utils'

const PAGE_SIZE = 10

export function EnterpriseList() {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<Enterprise['status'] | ''>('')
  const { toast } = useToast()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['enterprises', { page, keyword, status }],
    queryFn: () => getEnterprises({ page, keyword, status, pageSize: PAGE_SIZE }),
  })

  const handleSearch = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  const handleStatusChange = (value: 'ALL' | Enterprise['status']) => {
    setStatus(value === 'ALL' ? '' : value as Enterprise['status'])
    setPage(1)
  }

  const handleStatusUpdate = async (id: string, newStatus: Enterprise['status']) => {
    try {
      await updateEnterpriseStatus(id, newStatus)
      toast({
        title: '更新成功',
        description: '企业状态已更新',
      })
      refetch()
    } catch (error) {
      toast({
        title: '更新失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="搜索企业名称或代码"
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="企业状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">全部</SelectItem>
            <SelectItem value="ACTIVE">正常</SelectItem>
            <SelectItem value="SUSPENDED">已暂停</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>企业代码</TableHead>
              <TableHead>企业名称</TableHead>
              <TableHead>联系人</TableHead>
              <TableHead>联系电话</TableHead>
              <TableHead>地址</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>最后同步</TableHead>
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
              data.items.map((enterprise: Enterprise) => (
                <TableRow key={enterprise.id}>
                  <TableCell>{enterprise.code}</TableCell>
                  <TableCell>{enterprise.name}</TableCell>
                  <TableCell>{enterprise.contact.person}</TableCell>
                  <TableCell>{enterprise.contact.phone}</TableCell>
                  <TableCell>{enterprise.contact.address}</TableCell>
                  <TableCell>
                    <Badge
                      variant={enterprise.status === 'ACTIVE' ? 'default' : 'secondary'}
                    >
                      {enterprise.status === 'ACTIVE' ? '正常' : '已暂停'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(enterprise.syncTime)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(
                          enterprise.id,
                          enterprise.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                        )
                      }
                    >
                      {enterprise.status === 'ACTIVE' ? '暂停' : '启用'}
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