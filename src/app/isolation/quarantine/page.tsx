'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { SearchForm } from '@/components/common/SearchForm'
import type { SearchField, TableColumn } from '@/types/common'
import { StatusBadge } from "@/components/shared/StatusBadge"

interface QuarantineProcess {
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
  facility: {
    id: string
    name: string
  }
  findings: {
    preliminary: string[]
    isolation: string[]
  }
  processing: {
    noticeNo?: string
    method?: 'DESTROY' | 'STERILIZE' | 'DETOXIFY'
    quantity?: number
    unit?: string
    date?: string
    result?: string
  }
  status: 'PENDING' | 'NOTICED' | 'PROCESSING' | 'COMPLETED'
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
      { label: '待处理', value: 'PENDING' },
      { label: '已通知', value: 'NOTICED' },
      { label: '处理中', value: 'PROCESSING' },
      { label: '已完成', value: 'COMPLETED' },
    ],
  },
  {
    type: 'dateRange',
    name: 'processDate',
    label: '处理日期',
    placeholder: '请选择日期范围',
  },
]

const statusMap = {
  PENDING: { text: '待处理', variant: 'warning' },
  NOTICED: { text: '已通知', variant: 'info' },
  PROCESSING: { text: '处理中', variant: 'info' },
  COMPLETED: { text: '已完成', variant: 'success' },
} as const

// 表格列配置
const columns: TableColumn<QuarantineProcess>[] = [
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
    title: '隔离场所',
    dataIndex: ['facility', 'name'],
    key: 'facilityName',
  },
  {
    title: '发现问题',
    dataIndex: 'findings',
    key: 'findings',
    render: (findings: QuarantineProcess['findings']) => (
      <div className="space-y-2">
        {findings.preliminary.length > 0 && (
          <div className="text-sm">
            <span className="font-medium">初检：</span>
            {findings.preliminary.join('、')}
          </div>
        )}
        {findings.isolation.length > 0 && (
          <div className="text-sm">
            <span className="font-medium">隔离期：</span>
            {findings.isolation.join('、')}
          </div>
        )}
      </div>
    ),
  },
  {
    title: '处理情况',
    dataIndex: 'processing',
    key: 'processing',
    render: (processing: QuarantineProcess['processing']) => (
      processing.method ? (
        <div className="space-y-1">
          <div className="text-sm">
            通知书编号：{processing.noticeNo}
          </div>
          <div className="text-sm">
            处理方式：{
              {
                DESTROY: '销毁',
                STERILIZE: '除害处理',
                DETOXIFY: '消毒处理',
              }[processing.method]
            }
          </div>
          <div className="text-sm">
            处理数量：{processing.quantity} {processing.unit}
          </div>
          {processing.date && (
            <div className="text-sm">
              处理日期：{processing.date}
            </div>
          )}
          {processing.result && (
            <div className="text-sm">
              处理结果：{processing.result}
            </div>
          )}
        </div>
      ) : (
        <span className="text-gray-400">未处理</span>
      )
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
]

export default function QuarantinePage() {
  // 加载状态
  const [loading, setLoading] = useState(false)
  // 表格数据
  const [dataSource, setDataSource] = useState<QuarantineProcess[]>([])
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
        <h2 className="text-2xl font-bold tracking-tight">检疫处理</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          新增处理
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
        <DataTable<QuarantineProcess>
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