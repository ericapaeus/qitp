import { APIResponse, PaginationQuery, SortQuery, TimeRangeQuery } from './index'

/**
 * 企业基本信息
 */
export interface Enterprise {
  id: string
  code: string
  name: string
  contact: {
    address: string
    person: string
    phone: string
  }
  status: 'ACTIVE' | 'SUSPENDED'
  syncTime: string
  createdAt: string
  updatedAt: string
}

/**
 * 引种申请
 */
export interface ImportApplication {
  id: string
  enterpriseId: string
  enterpriseName: string
  approvalNo: string
  quarantineCertNo?: string
  plant: {
    name: string
    scientificName: string
    variety: string
    sourceCountry: string
    quantity: number
    unit: string
    purpose: string
  }
  importInfo: {
    entryPort: string
    plannedDate: string
    actualDate?: string
  }
  isolationInfo?: {
    facilityId: string
    startDate?: string
    endDate?: string
  }
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
}

// 企业查询参数
export interface EnterpriseQuery extends PaginationQuery, SortQuery {
  keyword?: string
  province?: string
  city?: string
  status?: string
}

// 企业 API 定义
export interface EnterpriseAPI {
  // 企业列表
  'GET /api/enterprises': {
    query: EnterpriseQuery
    response: APIResponse<Enterprise[]>
  }
  
  // 创建企业
  'POST /api/enterprises': {
    body: Omit<Enterprise, 'id' | 'createdAt' | 'updatedAt'>
    response: APIResponse<Enterprise>
  }
  
  // 获取企业详情
  'GET /api/enterprises/:id': {
    params: { id: string }
    response: APIResponse<Enterprise>
  }
  
  // 更新企业
  'PUT /api/enterprises/:id': {
    params: { id: string }
    body: Partial<Omit<Enterprise, 'id' | 'createdAt' | 'updatedAt'>>
    response: APIResponse<Enterprise>
  }
}

// 引种申请查询参数
export interface ImportApplicationQuery extends PaginationQuery, SortQuery, TimeRangeQuery {
  enterpriseId?: string
  status?: string
  plantName?: string
  sourceCountry?: string
}

// 引种申请 API 定义
export interface ImportApplicationAPI {
  // 引种申请列表
  'GET /api/enterprises/:enterpriseId/applications': {
    params: { enterpriseId: string }
    query: ImportApplicationQuery
    response: APIResponse<ImportApplication[]>
  }
  
  // 创建引种申请
  'POST /api/enterprises/:enterpriseId/applications': {
    params: { enterpriseId: string }
    body: Omit<ImportApplication, 'id' | 'enterpriseId' | 'applicationNo' | 'status' | 'createdAt' | 'updatedAt'>
    response: APIResponse<ImportApplication>
  }
  
  // 获取引种申请详情
  'GET /api/enterprises/applications/:id': {
    params: { id: string }
    response: APIResponse<ImportApplication>
  }
  
  // 审核引种申请
  'PATCH /api/enterprises/applications/:id/review': {
    params: { id: string }
    body: {
      approved: boolean
      comments: string
      quarantineRequired?: boolean
      quarantineSite?: string
      quarantinePeriod?: number
    }
    response: APIResponse<ImportApplication>
  }
}

export interface EnterpriseCreateInput {
  code: string
  name: string
  contact: Enterprise['contact']
  status: Enterprise['status']
}

export interface EnterpriseUpdateInput extends Partial<EnterpriseCreateInput> {
  syncTime?: string
}

export interface ImportApplicationCreateInput {
  enterpriseId: string
  approvalNo: string
  plant: ImportApplication['plant']
  importInfo: Omit<ImportApplication['importInfo'], 'actualDate'>
}

export interface ImportApplicationReviewInput {
  status: 'APPROVED' | 'REJECTED'
  quarantineCertNo?: string
  remarks?: string
}

/**
 * 同步结果
 */
export interface SyncResult {
  success: boolean
  syncCount: number
  syncTime: string
  errorMessage?: string
}

/**
 * 企业列表响应
 */
export interface EnterprisesResponse {
  total: number
  items: Enterprise[]
  pagination: {
    current: number
    pageSize: number
    total: number
  }
}

/**
 * 引种记录
 */
export interface ImportRecord {
  id: string
  enterpriseId: string
  approvalNo: string
  quarantineCertNo?: string
  plant: {
    name: string
    scientificName: string
    variety: string
    sourceCountry: string
    quantity: number
    unit: string
    purpose: string
  }
  importInfo: {
    entryPort: string
    plannedDate: string
    actualDate?: string
  }
  isolationInfo?: {
    facilityId: string
    startDate?: string
    endDate?: string
  }
  status: 'PENDING' | 'IMPORTING' | 'ISOLATING' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

/**
 * 引种记录列表响应
 */
export interface ImportRecordsResponse {
  total: number
  items: ImportRecord[]
  pagination: {
    current: number
    pageSize: number
    total: number
  }
} 