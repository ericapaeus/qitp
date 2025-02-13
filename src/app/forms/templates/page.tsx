'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { SearchForm } from '@/components/common/SearchForm'
import type { SearchField, TableColumn } from '@/types/common'

interface FormTemplate {
  key: string
  code: string
  name: string
  type: 'REGISTRATION' | 'REPORT' | 'NOTICE' | 'CERTIFICATE' | 'LABEL'
  version: string
  content: {
    html: string
    css?: string
    fields: Array<{
      key: string
      label: string
      type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'signature'
      required: boolean
      options?: string[]
      defaultValue?: any
      validation?: {
        pattern?: string
        min?: number
        max?: number
        message?: string
      }
    }>
  }
  printConfig?: {
    pageSize: 'A4' | 'A5' | 'CUSTOM'
    orientation: 'portrait' | 'landscape'
    margin: {
      top: number
      right: number
      bottom: number
      left: number
    }
  }
  status: 'DRAFT' | 'PUBLISHED' | 'DEPRECATED'
  createdAt: string
  updatedAt: string
}

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    type: 'text',
    name: 'keyword',
    label: '关键词',
    placeholder: '模板名称/编号',
  },
  {
    type: 'select',
    name: 'type',
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
      { label: '已发布', value: 'PUBLISHED' },
      { label: '已废弃', value: 'DEPRECATED' },
    ],
  },
]

// 表格列配置
const columns: TableColumn<FormTemplate>[] = [
  {
    title: '模板编号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '模板名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '表单类型',
    dataIndex: 'type',
    key: 'type',
    render: (type: string) => ({
      REGISTRATION: '登记表',
      REPORT: '报告',
      NOTICE: '通知书',
      CERTIFICATE: '证书',
      LABEL: '标签',
    }[type]),
  },
  {
    title: '版本号',
    dataIndex: 'version',
    key: 'version',
  },
  {
    title: '字段数量',
    dataIndex: ['content', 'fields'],
    key: 'fieldCount',
    render: (fields: FormTemplate['content']['fields']) => fields.length,
  },
  {
    title: '打印配置',
    dataIndex: 'printConfig',
    key: 'printConfig',
    render: (config?: FormTemplate['printConfig']) => (
      config ? (
        <div className="space-y-1">
          <div className="text-sm">
            纸张：{config.pageSize} ({config.orientation})
          </div>
          <div className="text-sm">
            边距：{config.margin.top}/{config.margin.right}/{config.margin.bottom}/{config.margin.left}
          </div>
        </div>
      ) : (
        <span className="text-gray-400">默认配置</span>
      )
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const statusMap = {
        DRAFT: { text: '草稿', color: 'text-gray-600' },
        PUBLISHED: { text: '已发布', color: 'text-green-600' },
        DEPRECATED: { text: '已废弃', color: 'text-red-600' },
      }
      const { text, color } = statusMap[status as keyof typeof statusMap]
      return <span className={color}>{text}</span>
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
]

export default function TemplatesPage() {
  // 加载状态
  const [loading, setLoading] = useState(false)
  // 表格数据
  const [dataSource, setDataSource] = useState<FormTemplate[]>([])
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
        <h2 className="text-2xl font-bold tracking-tight">表单模板</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          新增模板
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
        <DataTable<FormTemplate>
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