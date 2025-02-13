import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TableColumn<T> {
  title: string
  dataIndex: string | string[]
  key: string
  width?: number
  render?: (value: any, record: T) => React.ReactNode
}

interface DataTableProps<T> {
  loading?: boolean
  columns: TableColumn<T>[]
  dataSource: T[]
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
  onChange?: (current: number, pageSize: number) => void
  className?: string
}

export function DataTable<T>({
  loading,
  columns,
  dataSource,
  pagination,
  onChange,
  className,
}: DataTableProps<T>) {
  const getValue = (record: T, dataIndex: string | string[]) => {
    if (Array.isArray(dataIndex)) {
      return dataIndex.reduce((obj: any, key) => obj?.[key], record)
    }
    return (record as any)[dataIndex]
  }

  const handlePageChange = (delta: number) => {
    if (pagination && onChange) {
      const newPage = pagination.current + delta
      if (newPage >= 1 && newPage <= Math.ceil(pagination.total / pagination.pageSize)) {
        onChange(newPage, pagination.pageSize)
      }
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead
                  key={column.key}
                  style={{ width: column.width }}
                  className="whitespace-nowrap"
                >
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : dataSource.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              dataSource.map((record, index) => (
                <TableRow key={index}>
                  {columns.map(column => (
                    <TableCell key={column.key} className="whitespace-nowrap">
                      {column.render
                        ? column.render(getValue(record, column.dataIndex), record)
                        : getValue(record, column.dataIndex)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-gray-500">
            共 {pagination.total} 条记录
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(-1)}
              disabled={pagination.current === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              第 {pagination.current} 页，共{' '}
              {Math.ceil(pagination.total / pagination.pageSize)} 页
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={
                pagination.current ===
                Math.ceil(pagination.total / pagination.pageSize)
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 