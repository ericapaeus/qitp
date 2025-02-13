'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { SearchForm } from '@/components/common/SearchForm'
import type { SearchField, TableColumn } from '@/types/common'
import { StatusBadge } from "@/components/shared/StatusBadge"

interface LaboratoryTask {
  key: string
  registrationNo: string
  enterprise: {
    id: string
    name: string
  }
  plant: {
    chineseName: string
    scientificName: string
    variety: string
    sourceCountry: string
  }
  sample: {
    type: string
    quantity: number
    unit: string
    collectionDate: string
  }
  assignee?: {
    id: string
    name: string
  }
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    type: 'text',
    name: 'keyword',
    label: '关键词',
    placeholder: '登记号/企业名称',
  },
  {
    type: 'select',
    name: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '待分配', value: 'PENDING' },
      { label: '检验中', value: 'IN_PROGRESS' },
      { label: '已完成', value: 'COMPLETED' },
    ],
  },
  {
    type: 'dateRange',
    name: 'createdAt',
    label: '创建日期',
    placeholder: '请选择日期范围',
  },
]

const statusMap = {
  PENDING: { text: '待分配', variant: 'warning' },
  IN_PROGRESS: { text: '检验中', variant: 'info' },
  COMPLETED: { text: '已完成', variant: 'success' },
} as const

// 表格列配置
const columns: TableColumn<LaboratoryTask>[] = [
  {
    title: '登记号',
    dataIndex: 'registrationNo',
    key: 'registrationNo',
  },
  {
    title: '企业名称',
    dataIndex: ['enterprise', 'name'],
    key: 'enterpriseName',
  },
  {
    title: '植物名称',
    dataIndex: ['plant', 'chineseName'],
    key: 'plantName',
  },
  {
    title: '品种',
    dataIndex: ['plant', 'variety'],
    key: 'variety',
  },
  {
    title: '样品信息',
    dataIndex: 'sample',
    key: 'sample',
    render: (sample: LaboratoryTask['sample']) => (
      <div className="space-y-1">
        <div className="text-sm">类型：{sample.type}</div>
        <div className="text-sm">
          数量：{sample.quantity} {sample.unit}
        </div>
        <div className="text-sm">采样日期：{sample.collectionDate}</div>
      </div>
    ),
  },
  {
    title: '检验人员',
    dataIndex: ['assignee', 'name'],
    key: 'assigneeName',
    render: (name?: string) => name || (
      <span className="text-gray-400">未分配</span>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <StatusBadge status={status} statusMap={statusMap} />
    ),
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
]

export default function TasksPage() {
  // 加载状态
  const [loading, setLoading] = useState(false)
  // 表格数据
  const [dataSource, setDataSource] = useState<LaboratoryTask[]>([])
  // 分页信息
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  // 处理搜索
  const handleSearch = (values: Record<string, any>) => {
    console.log('Search values:', values)
    // TODO: 调用搜索 API
  }

  // 处理分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ ...pagination, current: page, pageSize })
    // TODO: 重新加载数据
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">检验任务</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          新增任务
        </Button>
      </div>

      {/* 搜索表单 */}
      <Card>
        <SearchForm
          fields={searchFields}
          onSubmit={handleSearch}
          columns={3}
        />
      </Card>

      {/* 数据表格 */}
      <Card>
        <DataTable<LaboratoryTask>
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handlePageChange,
          }}
          bordered
          showIndex
        />
      </Card>
    </div>
  )
} 