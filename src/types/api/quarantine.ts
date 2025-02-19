import { APIResponse, PaginationQuery, SortQuery, TimeRangeQuery } from './index'

/**
 * 检疫场所
 */
export interface QuarantineSite {
  id: string
  name: string
  type: 'GREENHOUSE' | 'LABORATORY' | 'FIELD'
  capacity: number
  location: string
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

/**
 * 检疫样品
 */
export interface QuarantineSample {
  id: string
  siteId: string
  registrationNo: string
  plantName: string
  quantity: string
  sourceCountry: string
  status: 'REGISTERED' | 'IN_QUARANTINE' | 'COMPLETED'
  attachments: Array<{
    id: string
    name: string
    url: string
    type: string
    size: number
    uploadedAt: string
  }>
  createdAt: string
  updatedAt: string
}

/**
 * 检疫任务
 */
export interface QuarantineTask {
  id: string
  type: 'PRELIMINARY' | 'ISOLATION' | 'LABORATORY'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  assignee: {
    id: string
    name: string
  }
  subject: {
    type: string
    name: string
    quantity: number
    unit: string
  }
  progress: number
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

/**
 * 检疫场所 API 定义
 */
export interface QuarantineAPI {
  // 获取检疫场所列表
  'GET /api/quarantine/sites': {
    query: {
      type?: QuarantineSite['type'] | 'all'
      status?: QuarantineSite['status'] | 'all'
    }
    response: APIResponse<QuarantineSite[]>
  }

  // 获取单个检疫场所
  'GET /api/quarantine/sites/:id': {
    params: { id: string }
    response: APIResponse<QuarantineSite>
  }

  // 创建检疫场所
  'POST /api/quarantine/sites': {
    body: Omit<QuarantineSite, 'id' | 'createdAt' | 'updatedAt'>
    response: APIResponse<QuarantineSite>
  }

  // 更新检疫场所
  'PUT /api/quarantine/sites/:id': {
    params: { id: string }
    body: Partial<Omit<QuarantineSite, 'id' | 'createdAt' | 'updatedAt'>>
    response: APIResponse<QuarantineSite>
  }

  // 获取检疫样品列表
  'GET /api/quarantine/samples': {
    query: {
      siteId?: string
      status?: QuarantineSample['status'] | 'all'
    }
    response: APIResponse<QuarantineSample[]>
  }

  // 获取单个检疫样品
  'GET /api/quarantine/samples/:id': {
    params: { id: string }
    response: APIResponse<QuarantineSample>
  }

  // 创建检疫样品
  'POST /api/quarantine/samples': {
    body: Omit<QuarantineSample, 'id' | 'attachments' | 'createdAt' | 'updatedAt'>
    response: APIResponse<QuarantineSample>
  }

  // 更新检疫样品
  'PUT /api/quarantine/samples/:id': {
    params: { id: string }
    body: Partial<Omit<QuarantineSample, 'id' | 'attachments' | 'createdAt' | 'updatedAt'>>
    response: APIResponse<QuarantineSample>
  }

  // 更新检疫样品状态
  'PATCH /api/quarantine/samples/:id/status': {
    params: { id: string }
    body: {
      status: QuarantineSample['status']
    }
    response: APIResponse<QuarantineSample>
  }

  // 上传检疫样品附件
  'POST /api/quarantine/samples/:id/attachments': {
    params: { id: string }
    body: {
      name: string
      url: string
      type: string
      size: number
    }
    response: APIResponse<QuarantineSample['attachments'][0]>
  }

  // 获取检疫任务列表
  'GET /api/quarantine/tasks': {
    query: PaginationQuery & SortQuery & TimeRangeQuery & {
      keyword?: string
      status?: QuarantineTask['status'] | 'all'
      type?: QuarantineTask['type'] | 'all'
    }
    response: APIResponse<QuarantineTask[]>
  }

  // 获取单个检疫任务
  'GET /api/quarantine/tasks/:id': {
    params: { id: string }
    response: APIResponse<QuarantineTask>
  }
} 