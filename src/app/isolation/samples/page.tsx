'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { SearchForm } from '@/components/common/SearchForm'
import type { SearchField, TableColumn } from '@/types/common'
import { StatusBadge } from "@/components/shared/StatusBadge"

interface IsolationSample {
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
    part: string
    sourceCountry: string
    entryPort: string
    entryQuantity: number
    entryDate: string
    sampleQuantity: number
    packageMaterial: string
  }
  approvalInfo: {
    approvalNo: string
    quarantineCertNo: string
    releaseNoticeNo: string
    needRiskAnalysis: boolean
  }
  registrationDate: string
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED'
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
      { label: '草稿', value: 'DRAFT' },
      { label: '已提交', value: 'SUBMITTED' },
      { label: '已审核', value: 'APPROVED' },
    ],
  },
  {
    type: 'dateRange',
    name: 'registrationDate',
    label: '登记日期',
    placeholder: '请选择日期范围',
  },
]

const statusMap = {
  DRAFT: { text: '草稿', variant: 'default' },
  SUBMITTED: { text: '已提交', variant: 'info' },
  APPROVED: { text: '已审核', variant: 'success' },
} as const

// 表格列配置
const columns: TableColumn<IsolationSample>[] = [
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
    title: '来源国',
    dataIndex: ['plant', 'sourceCountry'],
    key: 'sourceCountry',
  },
  {
    title: '送检数量',
    dataIndex: ['plant', 'sampleQuantity'],
    key: 'sampleQuantity',
  },
  {
    title: '登记日期',
    dataIndex: 'registrationDate',
    key: 'registrationDate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <StatusBadge status={status} statusMap={statusMap} />
    ),
  },
]

export default function SamplesPage() {
  // 加载状态
  const [loading, setLoading] = useState(false)
  // 表格数据
  const [dataSource, setDataSource] = useState<IsolationSample[]>([])
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
        <h2 className="text-2xl font-bold tracking-tight">样品接收</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          新增样品
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
        <DataTable<IsolationSample>
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