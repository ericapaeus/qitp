'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DownloadIcon } from '@radix-ui/react-icons'
import { getImportRecords } from '@/lib/api/enterprises'
import { formatDate } from '@/lib/utils'
import type { ImportRecord } from '@/types/api/enterprises'

const PAGE_SIZE = 10

interface EnterpriseImportsProps {
  enterpriseId: string
}

const statusMap: Record<ImportRecord['status'], { label: string; variant: 'secondary' | 'default' | 'warning' | 'success' }> = {
  PENDING: { label: '待处理', variant: 'secondary' },
  IMPORTING: { label: '引种中', variant: 'default' },
  ISOLATING: { label: '隔离中', variant: 'warning' },
  COMPLETED: { label: '已完成', variant: 'success' },
}

export function EnterpriseImports({ enterpriseId }: EnterpriseImportsProps) {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['importRecords', enterpriseId, page],
    queryFn: () =>
      getImportRecords(enterpriseId, {
        page,
        pageSize: PAGE_SIZE,
      }),
  })

  const handleExport = async () => {
    try {
      // TODO: 实现导出功能
      const records = await getImportRecords(enterpriseId, {
        page: 1,
        pageSize: 9999,
      })

      const csv = [
        [
          '申请编号',
          '检疫证号',
          '植物名称',
          '学名',
          '品种',
          '来源国',
          '数量',
          '单位',
          '用途',
          '入境口岸',
          '计划日期',
          '实际日期',
          '隔离设施',
          '隔离开始',
          '隔离结束',
          '状态',
          '创建时间',
          '更新时间',
        ].join(','),
        ...records.items.map((record: ImportRecord) =>
          [
            record.approvalNo,
            record.quarantineCertNo,
            record.plant.name,
            record.plant.scientificName,
            record.plant.variety,
            record.plant.sourceCountry,
            record.plant.quantity,
            record.plant.unit,
            record.plant.purpose,
            record.importInfo.entryPort,
            record.importInfo.plannedDate,
            record.importInfo.actualDate,
            record.isolationInfo?.facilityId,
            record.isolationInfo?.startDate,
            record.isolationInfo?.endDate,
            statusMap[record.status].label,
            formatDate(record.createdAt),
            formatDate(record.updatedAt),
          ].join(',')
        ),
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `import_records_${enterpriseId}_${formatDate(
        new Date().toISOString()
      )}.csv`
      link.click()
    } catch (error) {
      console.error('导出失败:', error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>引种记录</CardTitle>
          <CardDescription>查看企业的引种申请记录</CardDescription>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <DownloadIcon className="h-4 w-4" />
          导出记录
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>申请编号</TableHead>
                <TableHead>植物名称</TableHead>
                <TableHead>来源国</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>入境口岸</TableHead>
                <TableHead>计划日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>更新时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((record: ImportRecord) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.approvalNo}</TableCell>
                    <TableCell>
                      <div>{record.plant.name}</div>
                      <div className="text-sm text-gray-500">
                        {record.plant.scientificName}
                      </div>
                    </TableCell>
                    <TableCell>{record.plant.sourceCountry}</TableCell>
                    <TableCell>
                      {record.plant.quantity} {record.plant.unit}
                    </TableCell>
                    <TableCell>{record.importInfo.entryPort}</TableCell>
                    <TableCell>{record.importInfo.plannedDate}</TableCell>
                    <TableCell>
                      <Badge variant={statusMap[record.status].variant}>
                        {statusMap[record.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(record.updatedAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data && data.total > PAGE_SIZE && (
          <div className="mt-4 flex justify-center gap-2">
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
      </CardContent>
    </Card>
  )
} 