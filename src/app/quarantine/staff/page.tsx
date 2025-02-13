'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, RotateCw } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { SearchForm } from '@/components/common/SearchForm'
import type { SearchField, TableColumn } from '@/types/common'
import { StatusBadge } from "@/components/shared/StatusBadge"

interface QuarantineStaff {
  key: string
  id: string
  organizationId: string
  organizationName: string
  name: string
  title: string
  specialties: string[]
  certifications: Array<{
    type: string
    no: string
    issueDate: string
    expiryDate: string
  }>
  status: 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED'
}

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    type: 'text',
    name: 'keyword',
    label: '关键词',
    placeholder: '姓名/证书编号',
  },
  {
    type: 'select',
    name: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '在职', value: 'ACTIVE' },
      { label: '休假', value: 'ON_LEAVE' },
      { label: '停职', value: 'SUSPENDED' },
    ],
  },
]

const statusMap = {
  ACTIVE: { text: '在职', variant: 'success' },
  ON_LEAVE: { text: '休假', variant: 'warning' },
  SUSPENDED: { text: '停职', variant: 'error' },
} as const

// 表格列配置
const columns: TableColumn<QuarantineStaff>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '所属机构',
    dataIndex: 'organizationName',
    key: 'organizationName',
  },
  {
    title: '职称',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '专业领域',
    dataIndex: 'specialties',
    key: 'specialties',
    render: (specialties: string[]) => specialties.join('、'),
  },
  {
    title: '证书',
    dataIndex: 'certifications',
    key: 'certifications',
    render: (certifications: QuarantineStaff['certifications']) => (
      <div className="space-y-1">
        {certifications.map((cert, index) => (
          <div key={index} className="text-sm">
            {cert.type}: {cert.no}
            <span className="ml-2 text-gray-500">
              {cert.issueDate} ~ {cert.expiryDate}
            </span>
          </div>
        ))}
      </div>
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

export default function StaffPage() {
  // 加载状态
  const [loading, setLoading] = useState(false)
  // 表格数据
  const [dataSource, setDataSource] = useState<QuarantineStaff[]>([])
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

  // 处理同步
  const handleSync = () => {
    console.log('Syncing data...')
    // TODO: 调用同步 API
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">检疫人员</h2>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleSync}>
            <RotateCw className="w-4 h-4 mr-2" />
            同步数据
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            新增人员
          </Button>
        </div>
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
        <DataTable<QuarantineStaff>
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