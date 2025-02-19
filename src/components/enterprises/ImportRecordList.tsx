import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { APIResponse } from '@/types/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface ImportRecord {
  id: string
  enterpriseId: string
  enterpriseName: string
  approvalNo: string
  plant: {
    name: string
    scientificName: string
    variety: string
    sourceCountry: string
    quantity: number
    unit: string
    purpose: string
  }
  importInfo: {
    entryPort: string
    plannedDate: string
    actualDate?: string
  }
  isolationInfo?: {
    facilityId: string
    startDate: string
    endDate?: string
  }
  status: 'PENDING' | 'IMPORTING' | 'ISOLATING' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

export function ImportRecordList() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<ImportRecord['status'] | ''>('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const { data, isLoading } = useQuery<APIResponse<ImportRecord[]>>({
    queryKey: ['import-records', { page, pageSize, keyword, status, startTime, endTime }],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(keyword && { keyword }),
        ...(status && { status }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime })
      })
      const response = await fetch(`/api/enterprises/imports?${searchParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch import records')
      }
      return response.json()
    }
  })

  const records = data?.data || []
  const total = data?.pagination?.total || 0

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="搜索企业名称或审批号"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="max-w-xs"
        />
        <Select value={status} onValueChange={value => setStatus(value as ImportRecord['status'])}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部</SelectItem>
            <SelectItem value="PENDING">待引种</SelectItem>
            <SelectItem value="IMPORTING">引种中</SelectItem>
            <SelectItem value="ISOLATING">隔离中</SelectItem>
            <SelectItem value="COMPLETED">已完成</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
          className="max-w-xs"
        />
        <Input
          type="date"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" onClick={() => {
          setKeyword('')
          setStatus('')
          setStartTime('')
          setEndTime('')
        }}>
          重置
        </Button>
        <Button>新增记录</Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>企业名称</TableHead>
              <TableHead>审批号</TableHead>
              <TableHead>植物名称</TableHead>
              <TableHead>来源国</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>进境口岸</TableHead>
              <TableHead>计划时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map(record => (
              <TableRow key={record.id}>
                <TableCell>{record.enterpriseName}</TableCell>
                <TableCell>{record.approvalNo}</TableCell>
                <TableCell>
                  {record.plant.name} ({record.plant.variety})
                </TableCell>
                <TableCell>{record.plant.sourceCountry}</TableCell>
                <TableCell>
                  {record.plant.quantity} {record.plant.unit}
                </TableCell>
                <TableCell>{record.importInfo.entryPort}</TableCell>
                <TableCell>{record.importInfo.plannedDate}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-sm ${
                    record.status === 'PENDING' ? 'bg-gray-100 text-gray-700' :
                    record.status === 'IMPORTING' ? 'bg-blue-100 text-blue-700' :
                    record.status === 'ISOLATING' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {{
                      PENDING: '待引种',
                      IMPORTING: '引种中',
                      ISOLATING: '隔离中',
                      COMPLETED: '已完成'
                    }[record.status]}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">编辑</Button>
                    <Button size="sm" variant="outline">查看</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            共 {total} 条记录
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page * pageSize >= total}
            onClick={() => setPage(page + 1)}
          >
            下一页
          </Button>
        </div>
      </div>
    </Card>
  )
} 