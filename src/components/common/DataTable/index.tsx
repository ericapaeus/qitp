import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import type { DataTableProps, TableRowData, TableColumnType } from './types'
import { getNestedValue } from '@/lib/utils'

/**
 * 数据表格组件
 */
export function DataTable<T extends TableRowData>({
  columns,
  dataSource,
  loading = false,
  showIndex = false,
  rowSelection,
  pagination,
  onRowClick,
  emptyConfig,
  size = 'default',
  bordered = false,
  striped = true,
  resizable = false,
  scroll,
  sticky = false,
  className,
}: DataTableProps<T>) {
  // 计算表格样式
  const tableClassName = cn(
    'w-full',
    {
      'border-separate border-spacing-0': bordered,
      'table-fixed': !resizable,
    },
    className
  )

  // 处理行选择
  const handleRowSelect = React.useCallback(
    (key: string) => {
      if (!rowSelection) return
      const { selectedRowKeys, onChange } = rowSelection
      const newSelectedKeys = selectedRowKeys.includes(key)
        ? selectedRowKeys.filter((k) => k !== key)
        : [...selectedRowKeys, key]
      onChange(newSelectedKeys)
    },
    [rowSelection]
  )

  // 处理全选
  const handleSelectAll = React.useCallback(() => {
    if (!rowSelection) return
    const { selectedRowKeys, onChange } = rowSelection
    const allKeys = dataSource.map((item) => item.key)
    onChange(
      selectedRowKeys.length === allKeys.length ? [] : allKeys
    )
  }, [rowSelection, dataSource])

  // 渲染加载状态
  const renderLoading = () => (
    <TableRow>
      <TableCell
        colSpan={
          columns.length +
          (showIndex ? 1 : 0) +
          (rowSelection ? 1 : 0)
        }
        className="h-24"
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )

  // 渲染空状态
  const renderEmpty = () => (
    <TableRow>
      <TableCell
        colSpan={
          columns.length +
          (showIndex ? 1 : 0) +
          (rowSelection ? 1 : 0)
        }
        className="h-[400px] text-center"
      >
        {emptyConfig ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-muted/10 p-6">
              {emptyConfig.icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium tracking-tight">
                {emptyConfig.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {emptyConfig.description}
              </p>
            </div>
            {emptyConfig.action && (
              <Button
                variant="outline"
                onClick={emptyConfig.action.onClick}
              >
                {emptyConfig.action.label}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
            <p>暂无数据</p>
          </div>
        )}
      </TableCell>
    </TableRow>
  )

  return (
    <div className="w-full space-y-4">
      <div
        className={cn('rounded-md border', {
          'overflow-auto': scroll?.x || scroll?.y,
          [`max-h-[${scroll?.y}px]`]: scroll?.y,
        })}
      >
        <Table className={tableClassName}>
          <TableHeader className={cn({ 'sticky top-0 z-10 bg-background': sticky })}>
            <TableRow>
              {/* 序号列 */}
              {showIndex && (
                <TableHead className="w-[60px] text-center">序号</TableHead>
              )}

              {/* 选择框列 */}
              {rowSelection && (
                <TableHead className="w-[60px] text-center">
                  <Checkbox
                    checked={
                      rowSelection.selectedRowKeys.length > 0 &&
                      rowSelection.selectedRowKeys.length === dataSource.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}

              {/* 数据列 */}
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn({
                    [`w-[${column.width}px]`]: column.width,
                    'text-right': column.align === 'right',
                    'text-center': column.align === 'center',
                  })}
                >
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* 加载状态 */}
            {loading && renderLoading()}

            {/* 数据行 */}
            {!loading && dataSource.length > 0 && dataSource.map((record, index) => (
              <TableRow
                key={record.key}
                className={cn({
                  'bg-muted/50': striped && index % 2 === 1,
                  'cursor-pointer hover:bg-muted/50': onRowClick,
                })}
                onClick={() => onRowClick?.(record)}
              >
                {/* 序号列 */}
                {showIndex && (
                  <TableCell className="text-center">{index + 1}</TableCell>
                )}

                {/* 选择框列 */}
                {rowSelection && (
                  <TableCell className="text-center">
                    <Checkbox
                      checked={rowSelection.selectedRowKeys.includes(record.key)}
                      onCheckedChange={() => handleRowSelect(record.key)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                )}

                {/* 数据列 */}
                {columns.map((column) => {
                  const value = getNestedValue(record, column.dataIndex)
                  return (
                    <TableCell
                      key={column.key}
                      className={cn({
                        'text-right': column.align === 'right',
                        'text-center': column.align === 'center',
                      })}
                    >
                      {column.render ? column.render(value, record) : value}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}

            {/* 空状态 */}
            {!loading && dataSource.length === 0 && renderEmpty()}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      {pagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-6 text-sm">
            <p className="text-muted-foreground">
              共 {pagination.total} 条记录
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">每页显示</span>
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(value) =>
                  pagination.onChange(1, Number(value))
                }
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">条</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onChange(1, pagination.pageSize)}
              disabled={pagination.current === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
              disabled={pagination.current === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              <div className="text-sm font-medium">第 {pagination.current} 页</div>
              <div className="text-sm text-muted-foreground">/ {Math.ceil(pagination.total / pagination.pageSize)} 页</div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
              disabled={pagination.current * pagination.pageSize >= pagination.total}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                pagination.onChange(
                  Math.ceil(pagination.total / pagination.pageSize),
                  pagination.pageSize
                )
              }
              disabled={pagination.current * pagination.pageSize >= pagination.total}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable 