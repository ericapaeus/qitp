'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { SearchForm } from '@/components/common/SearchForm'
import type { SearchField, TableColumn } from '@/types/common'

interface ExportTask {
  key: string
  taskNo: string
  type: 'ISOLATION' | 'QUARANTINE' | 'LABORATORY' | 'FORM'
  params: {
    dateRange?: [string, string]
    status?: string[]
    keyword?: string
  }
  format: 'EXCEL' | 'PDF'
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  result?: {
    fileUrl: string
    fileSize: number
    expireTime: string
  }
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
    type: 'select',
    name: 'type',
    label: '数据类型',
    placeholder: '请选择类型',
    options: [
      { label: '隔离试种', value: 'ISOLATION' },
      { label: '检疫处理', value: 'QUARANTINE' },
      { label: '实验室检验', value: 'LABORATORY' },
      { label: '表单数据', value: 'FORM' },
    ],
  },
  {
    type: 'select',
    name: 'format',
    label: '导出格式',
    placeholder: '请选择格式',
    options: [
      { label: 'Excel', value: 'EXCEL' },
      { label: 'PDF', value: 'PDF' },
    ],
  },
  {
    type: 'dateRange',
    name: 'dateRange',
    label: '数据日期',
    placeholder: '请选择日期范围',
  },
]

// 表格列配置
const columns: TableColumn<ExportTask>[] = [
  {
    title: '任务编号',
    dataIndex: 'taskNo',
    key: 'taskNo',
  },
  {
    title: '数据类型',
    dataIndex: 'type',
    key: 'type',
    render: (type: string) => ({
      ISOLATION: '隔离试种',
      QUARANTINE: '检疫处理',
      LABORATORY: '实验室检验',
      FORM: '表单数据',
    }[type]),
  },
  {
    title: '导出参数',
    dataIndex: 'params',
    key: 'params',
    render: (params: ExportTask['params']) => (
      <div className="space-y-1">
        {params.dateRange && (
          <div className="text-sm">
            日期范围：{params.dateRange[0]} ~ {params.dateRange[1]}
          </div>
        )}
        {params.status && (
          <div className="text-sm">
            状态：{params.status.join('、')}
          </div>
        )}
        {params.keyword && (
          <div className="text-sm">
            关键词：{params.keyword}
          </div>
        )}
      </div>
    ),
  },
  {
    title: '导出格式',
    dataIndex: 'format',
    key: 'format',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const statusMap = {
        PENDING: { text: '等待中', color: 'text-gray-600' },
        PROCESSING: { text: '导出中', color: 'text-blue-600' },
        COMPLETED: { text: '已完成', color: 'text-green-600' },
        FAILED: { text: '失败', color: 'text-red-600' },
      }
      const { text, color } = statusMap[status as keyof typeof statusMap]
      return <span className={color}>{text}</span>
    },
  },
  {
    title: '导出结果',
    dataIndex: 'result',
    key: 'result',
    render: (result?: ExportTask['result']) => (
      result ? (
        <div className="space-y-1">
          <div className="text-sm">
            文件大小：{(result.fileSize / 1024 / 1024).toFixed(2)} MB
          </div>
          <div className="text-sm">
            过期时间：{result.expireTime}
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={result.fileUrl} target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" />
              下载文件
            </a>
          </Button>
        </div>
      ) : (
        <span className="text-gray-400">暂无</span>
      )
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

export default function ExportPage() {
  // 加载状态
  const [loading, setLoading] = useState(false)
  // 表格数据
  const [dataSource, setDataSource] = useState<ExportTask[]>([])
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
        <h2 className="text-2xl font-bold tracking-tight">数据导出</h2>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          新建导出
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
        <DataTable<ExportTask>
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