import { APIResponse, PaginationQuery, SortQuery, TimeRangeQuery } from './index'

/**
 * 附件
 */
export interface Attachment {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedAt: string
}

/**
 * 用户
 */
export interface User {
  id: string
  name: string
}

/**
 * 处理决定通知书
 */
export interface ProcessDecision {
  id: string
  documentNo: string
  sampleId: string
  title: string
  content: string
  status: 'DRAFT' | 'ISSUED' | 'PROCESSED'
  issuedBy?: User
  issuedAt?: string
  attachments: Attachment[]
  createdAt: string
  updatedAt: string
}

/**
 * 处理报告
 */
export interface ProcessReport {
  id: string
  documentNo: string
  decisionId: string
  title: string
  content: string
  processor: {
    id: string
    name: string
  }
  processMethod: string
  processResult: string
  attachments: Attachment[]
  createdAt: string
  updatedAt: string
}

/**
 * 检疫放行证书
 */
export interface QuarantineRelease {
  id: string
  documentNo: string
  registrationNo: string
  title: string
  content: string
  issuer: {
    id: string
    name: string
  }
  issuedAt: string
  validUntil: string
  attachments: Attachment[]
  createdAt: string
  updatedAt: string
}

/**
 * 创建处理决定通知书请求
 */
export interface CreateProcessDecisionRequest {
  sampleId: string
  title: string
  content: string
}

/**
 * 创建处理报告请求
 */
export interface CreateProcessReportRequest {
  decisionId: string
  title: string
  content: string
  processMethod: string
  processResult: string
}

/**
 * 创建检疫放行证书请求
 */
export interface CreateQuarantineReleaseRequest {
  registrationNo: string
  title: string
  content: string
  validUntil: string
}

/**
 * 上传附件请求
 */
export interface UploadAttachmentRequest {
  name: string
  type: string
  size: number
  url: string
}

/**
 * 报告 API 定义
 */
export interface ReportAPI {
  // 获取处理决定通知书列表
  'GET /api/reports/decisions': {
    query: {
      sampleId?: string
      status?: ProcessDecision['status'] | 'all'
    }
    response: APIResponse<ProcessDecision[]>
  }

  // 获取单个处理决定通知书
  'GET /api/reports/decisions/:id': {
    params: { id: string }
    response: APIResponse<ProcessDecision>
  }

  // 创建处理决定通知书
  'POST /api/reports/decisions': {
    body: CreateProcessDecisionRequest
    response: APIResponse<ProcessDecision>
  }

  // 更新处理决定通知书
  'PUT /api/reports/decisions/:id': {
    params: { id: string }
    body: Partial<CreateProcessDecisionRequest>
    response: APIResponse<ProcessDecision>
  }

  // 签发处理决定通知书
  'PATCH /api/reports/decisions/:id/issue': {
    params: { id: string }
    body: {
      issuedBy: string
    }
    response: APIResponse<ProcessDecision>
  }

  // 获取处理报告列表
  'GET /api/reports/process-reports': {
    query: {
      decisionId?: string
    }
    response: APIResponse<ProcessReport[]>
  }

  // 获取单个处理报告
  'GET /api/reports/process-reports/:id': {
    params: { id: string }
    response: APIResponse<ProcessReport>
  }

  // 创建处理报告
  'POST /api/reports/process-reports': {
    body: CreateProcessReportRequest
    response: APIResponse<ProcessReport>
  }

  // 获取检疫放行证书列表
  'GET /api/reports/releases': {
    query: {
      registrationNo?: string
    }
    response: APIResponse<QuarantineRelease[]>
  }

  // 获取单个检疫放行证书
  'GET /api/reports/releases/:id': {
    params: { id: string }
    response: APIResponse<QuarantineRelease>
  }

  // 创建检疫放行证书
  'POST /api/reports/releases': {
    body: CreateQuarantineReleaseRequest
    response: APIResponse<QuarantineRelease>
  }

  // 上传报告附件
  'POST /api/reports/:type/:id/attachments': {
    params: {
      type: 'decisions' | 'process-reports' | 'releases'
      id: string
    }
    body: UploadAttachmentRequest
    response: APIResponse<Attachment>
  }
} 