import { APIResponse, PaginationQuery, SortQuery, TimeRangeQuery } from './index'

/**
 * 隔离样品
 */
export interface IsolationSample {
  id: string
  siteId: string
  registrationNo: string
  plantName: string
  quantity: string
  sourceCountry: string
  status: 'REGISTERED' | 'IN_QUARANTINE' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

/**
 * 环境数据
 */
export interface EnvironmentData {
  id: string
  time: string
  timestamp: string
  temperature: number
  humidity: number
  light: number
}

/**
 * 时间线项目
 */
export interface TimelineItem {
  id: string
  time: string
  timestamp: string
  title: string
  description: string
  status: 'success' | 'warning' | 'error'
  type: 'sample' | 'environment' | 'alert'
}

/**
 * 告警信息
 */
export interface Alert {
  id: string
  title: string
  description: string
  time: string
  timestamp: string
  level: 'info' | 'warning' | 'error'
  isRead: boolean
}

/**
 * 统计数据
 */
export interface IsolationStatistics {
  activeSamples: {
    value: number
    trend: string
    trendType: 'up' | 'down'
  }
  abnormalCount: {
    value: number
    trend: string
    trendType: 'up' | 'down'
    status: 'warning' | 'error'
  }
  pendingTasks: {
    value: number
    trend: string
    trendType: 'up' | 'down'
  }
  completionRate: {
    value: string
    trend: string
    trendType: 'up' | 'down'
    status: 'success' | 'warning'
  }
}

/**
 * 创建样品请求
 */
export interface CreateSampleRequest {
  siteId: string
  plantName: string
  quantity: string
  sourceCountry: string
}

/**
 * 隔离 API 定义
 */
export interface IsolationAPI {
  // 获取环境数据历史
  'GET /api/isolation/environment/history': {
    response: APIResponse<EnvironmentData[]>
  }

  // 获取最新环境数据
  'GET /api/isolation/environment/latest': {
    response: APIResponse<EnvironmentData>
  }

  // 获取时间线数据
  'GET /api/isolation/timeline': {
    query: {
      filter?: 'all' | 'warning' | 'today'
    }
    response: APIResponse<TimelineItem[]>
  }

  // 获取告警数据
  'GET /api/isolation/alerts': {
    response: APIResponse<Alert[]>
  }

  // 标记告警为已读
  'PATCH /api/isolation/alerts/:id/read': {
    params: { id: string }
    response: APIResponse<{ success: boolean }>
  }

  // 标记所有告警为已读
  'PATCH /api/isolation/alerts/read-all': {
    response: APIResponse<{ success: boolean }>
  }

  // 获取统计数据
  'GET /api/isolation/statistics': {
    response: APIResponse<IsolationStatistics>
  }

  // 获取样品列表
  'GET /api/isolation/samples': {
    query: {
      siteId?: string
      status?: IsolationSample['status'] | 'all'
    }
    response: APIResponse<IsolationSample[]>
  }

  // 获取单个样品
  'GET /api/isolation/samples/:id': {
    params: { id: string }
    response: APIResponse<IsolationSample>
  }

  // 创建样品
  'POST /api/isolation/samples': {
    body: CreateSampleRequest
    response: APIResponse<IsolationSample>
  }
} 