import { TableColumn } from '@/types/common'

/**
 * 数据表格属性
 */
export interface DataTableProps<T = any> {
  // 表格列定义
  columns: TableColumn<T>[]
  // 数据源
  dataSource: T[]
  // 加载状态
  loading?: boolean
  // 是否显示序号
  showIndex?: boolean
  // 是否显示选择框
  rowSelection?: {
    selectedRowKeys: string[]
    onChange: (selectedRowKeys: string[]) => void
  }
  // 分页配置
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  // 行点击事件
  onRowClick?: (record: T) => void
  // 空状态配置
  emptyConfig?: {
    icon?: React.ReactNode
    title?: string
    description?: string
    action?: {
      label: string
      onClick: () => void
    }
  }
  // 表格大小
  size?: 'default' | 'small' | 'large'
  // 是否显示边框
  bordered?: boolean
  // 是否显示斑马纹
  striped?: boolean
  // 是否可以调整列宽
  resizable?: boolean
  // 表格滚动配置
  scroll?: {
    x?: number | string | true
    y?: number | string
  }
  // 固定表头
  sticky?: boolean
  // 自定义类名
  className?: string
}

/**
 * 表格行数据
 */
export interface TableRowData {
  key: string
  [key: string]: any
}

/**
 * 表格列定义
 */
export interface TableColumnType<T = any> {
  title: string
  dataIndex: string | string[]
  key: string
  width?: number
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  render?: (value: any, record: T) => React.ReactNode
} 