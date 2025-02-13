'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { SearchForm } from '@/components/common/SearchForm'
import type { SearchField, TableColumn } from '@/types/common'
import { StatusBadge } from "@/components/shared/StatusBadge"

interface FormRecord {
  key: string
  formNo: string
  templateId: string
  templateName: string
  templateType: 'REGISTRATION' | 'REPORT' | 'NOTICE' | 'CERTIFICATE' | 'LABEL'
  relatedId?: string
  relatedType?: string
  data: Record<string, any>
  signatures?: Array<{
    field: string
    user: {
      id: string
      name: string
    }
    signedAt: string
    image?: string
  }>
  status: 'DRAFT' | 'SIGNED' | 'PRINTED' | 'VOIDED'
  createdBy: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    type: 'text',
    name: 'keyword',
    label: '关键词',
    placeholder: '表单编号/模板名称',
  },
  {
    type: 'select',
    name: 'templateType',
    label: '表单类型',
    placeholder: '请选择类型',
    options: [
      { label: '登记表', value: 'REGISTRATION' },
      { label: '报告', value: 'REPORT' },
      { label: '通知书', value: 'NOTICE' },
      { label: '证书', value: 'CERTIFICATE' },
      { label: '标签', value: 'LABEL' },
    ],
  },
  {
    type: 'select',
    name: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '草稿', value: 'DRAFT' },
      { label: '已签名', value: 'SIGNED' },
      { label: '已打印', value: 'PRINTED' },
      { label: '已作废', value: 'VOIDED' },
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
  DRAFT: { text: '草稿', variant: 'default' },
  SIGNED: { text: '已签名', variant: 'info' },
  PRINTED: { text: '已打印', variant: 'success' },
  VOIDED: { text: '已作废', variant: 'error' },
} as const

// 表格列配置
const columns: TableColumn<FormRecord>[] = [
  {
    title: '表单编号',
    dataIndex: 'formNo',
    key: 'formNo',
  },
  {
    title: '模板名称',
    dataIndex: 'templateName',
    key: 'templateName',
  },
  {
    title: '表单类型',
    dataIndex: 'templateType',
    key: 'templateType',
    render: (type: string) => ({
      REGISTRATION: '登记表',
      REPORT: '报告',
      NOTICE: '通知书',
      CERTIFICATE: '证书',
      LABEL: '标签',
    }[type]),
  },
  {
    title: '签名情况',
    dataIndex: 'signatures',
    key: 'signatures',
    render: (signatures?: FormRecord['signatures']) => (
      signatures ? (
        <div className="space-y-1">
          {signatures.map((sig, index) => (
            <div key={index} className="text-sm">
              {sig.field}：{sig.user.name}
              <span className="ml-2 text-gray-500">
                {sig.signedAt}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-gray-400">未签名</span>
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
  {
    title: '创建人',
    dataIndex: ['createdBy', 'name'],
    key: 'createdBy',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
]

export default function RecordsPage() {
  // 加载状态
  const [loading, setLoading] = useState(false)
  // 表格数据
  const [dataSource, setDataSource] = useState<FormRecord[]>([])
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
        <h2 className="text-2xl font-bold tracking-tight">表单记录</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          新增记录
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
        <DataTable<FormRecord>
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