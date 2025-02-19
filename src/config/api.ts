// API 配置
export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/',
  mock: process.env.NEXT_PUBLIC_API_MOCK === 'true',
  mockDelay: Number(process.env.NEXT_PUBLIC_API_MOCK_DELAY) || 100,
  defaultPageSize: 10,
  maxPageSize: 100,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  cache: {
    enable: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100
  },
  responseCode: {
    success: 200,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    serverError: 500
  }
} as const

// API 错误码
export const apiErrorCodes = {
  // 系统错误 (1xxxx)
  SYSTEM_ERROR: 10000,
  NETWORK_ERROR: 10001,
  TIMEOUT_ERROR: 10002,
  
  // 权限错误 (2xxxx)
  UNAUTHORIZED: 20001,
  FORBIDDEN: 20002,
  TOKEN_EXPIRED: 20003,
  
  // 请求参数错误 (3xxxx)
  INVALID_PARAMS: 30001,
  MISSING_PARAMS: 30002,
  
  // 业务逻辑错误 (4xxxx)
  BUSINESS_ERROR: 40001,
  RESOURCE_NOT_FOUND: 40004,
  
  // 第三方服务错误 (5xxxx)
  THIRD_PARTY_ERROR: 50001
} as const

// API 错误信息
export const apiErrorMessages: Record<keyof typeof apiErrorCodes, string> = {
  SYSTEM_ERROR: '系统错误',
  NETWORK_ERROR: '网络错误',
  TIMEOUT_ERROR: '请求超时',
  UNAUTHORIZED: '未授权',
  FORBIDDEN: '无权访问',
  TOKEN_EXPIRED: '登录已过期',
  INVALID_PARAMS: '无效的参数',
  MISSING_PARAMS: '缺少必要参数',
  BUSINESS_ERROR: '业务处理失败',
  RESOURCE_NOT_FOUND: '资源不存在',
  THIRD_PARTY_ERROR: '第三方服务异常'
}

// 生成缓存键
export function generateCacheKey(url: string, body?: any): string {
  if (body) {
    return `${url}:${JSON.stringify(body)}`
  }
  return url
}

// API 响应处理
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  if (data.code !== apiConfig.responseCode.success) {
    throw new Error(data.message || '请求失败')
  }
  return data.data
}

// API 错误处理
export function handleApiError(error: unknown): never {
  if (error instanceof Error) {
    // 可以根据错误类型进行不同的处理
    console.error('API Error:', error.message)
    throw error
  }
  throw new Error('未知错误')
}

// API 响应类型
export interface APIResponse<T = any> {
  code: number
  message: string
  data: T
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
}

// 分页查询参数
export interface PaginationQuery {
  page?: number
  pageSize?: number
}

// 排序查询参数
export interface SortQuery {
  sortField?: string
  sortOrder?: 'ascend' | 'descend'
}

// 时间范围查询参数
export interface TimeRangeQuery {
  startTime?: string
  endTime?: string
}

// API 错误
export interface APIError {
  code: number
  message: string
  details?: Record<string, any>
} 