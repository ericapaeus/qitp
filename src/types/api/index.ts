// 统一的 API 响应格式
export interface APIResponse<T> {
  code: number
  message: string
  data: T
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
}

// 统一的分页请求参数
export interface PaginationQuery {
  page?: number
  pageSize?: number
}

// 统一的排序请求参数
export interface SortQuery {
  sortField?: string
  sortOrder?: 'ascend' | 'descend'
}

// 统一的时间范围查询参数
export interface TimeRangeQuery {
  startTime?: string
  endTime?: string
}

// API 错误响应
export interface APIError {
  code: number
  message: string
  details?: Record<string, any>
} 