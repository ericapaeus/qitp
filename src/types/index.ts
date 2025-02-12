// 用户角色
export type UserRole = 'ADMIN' | 'ENTERPRISE' | 'QUARANTINE' | 'SUPERVISOR' | 'LEADER'

// 用户信息
export interface User {
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

// 分页参数
export interface PaginationParams {
  page: number
  pageSize: number
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[]
  total: number
}

// 通用响应
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 表单状态
export type FormStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'

// 签名信息
export interface Signature {
  name: string
  date: string
  image?: string
}

// 文件信息
export interface FileInfo {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadTime: string
}

// 选项类型
export interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

// 树形数据节点
export interface TreeNode {
  id: string
  label: string
  value: string
  children?: TreeNode[]
  disabled?: boolean
}

// 表格列定义
export interface TableColumn<T = any> {
  title: string
  dataIndex: keyof T
  key: string
  width?: number
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  render?: (value: any, record: T) => React.ReactNode
}

// 搜索表单字段
export interface SearchField {
  label: string
  name: string
  type: 'text' | 'select' | 'date' | 'dateRange'
  options?: Option[]
  placeholder?: string
} 