export interface Pagination {
  current: number
  pageSize: number
  total: number
}

export interface APIResponse<T = any> {
  code: number
  message: string
  data?: T
  pagination?: Pagination
}

export interface APIError {
  code: number
  message: string
} 