/**
 * 通用响应类型
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
}

/**
 * 表格列定义
 */
export interface TableColumn<T = any> {
  title: string
  dataIndex: string | string[]
  key: string
  width?: number
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  render?: (value: any, record: T) => React.ReactNode
  sorter?: boolean
}

/**
 * 搜索表单字段
 */
export interface SearchField {
  label: string
  name: string
  type: 'text' | 'select' | 'date' | 'dateRange'
  options?: Array<{
    label: string
    value: string | number
  }>
  placeholder?: string
}

/**
 * 状态标签类型
 */
export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default'

/**
 * 文件信息
 */
export interface FileInfo {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadTime: string
}

/**
 * 用户角色
 */
export type UserRole = 'ADMIN' | 'ENTERPRISE' | 'QUARANTINE' | 'SUPERVISOR' | 'LEADER'

/**
 * 用户信息
 */
export interface UserInfo {
  id: string
  username: string
  role: UserRole
  permissions: string[]
  enterprise?: {
    id: string
    name: string
  }
  organization?: {
    id: string
    name: string
    level: 'PROVINCE' | 'CITY'
  }
  facility?: {
    id: string
    name: string
    type: 'NATIONAL' | 'REGIONAL' | 'LOCAL' | 'ENTERPRISE'
  }
} 