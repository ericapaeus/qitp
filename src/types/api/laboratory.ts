// 基础类型
export type TaskStatus = 'pending' | 'in_progress' | 'completed'
export type TaskPriority = 'high' | 'normal' | 'low'
export type ConclusionType = 'PASS' | 'FAIL' | 'NEED_PROCESS'
export type ReviewStatusType = 'PENDING' | 'APPROVED' | 'REJECTED'
export type InspectionMethod = 'visual' | 'microscope' | 'culture' | 'molecular'

// 共享接口
export interface Inspector {
  id: string
  name: string
}

export interface Finding {
  id: string
  type: string
  description: string
}

export interface Attachment {
  id: string
  name: string
}

// 任务相关
export interface Task {
  id: string
  registrationNo: string
  plantName: string
  symptom: string
  samplingDate: string
  priority: TaskPriority
  status: TaskStatus
  inspector: Inspector | null
}

export interface AssignTaskRequest {
  inspectorId: string
  remarks?: string
}

export interface SubmitResultRequest {
  method: InspectionMethod
  findings: Finding[]
  conclusion: ConclusionType
  remarks?: string
  attachments?: Attachment[]
}

// 结果相关
export interface Result {
  id: string
  registrationNo: string
  plantName: string
  symptom: string
  inspectionDate: string
  inspector: Inspector
  method: InspectionMethod
  findings: Finding[]
  conclusion: ConclusionType
  reviewStatus: ReviewStatusType
  reviewer?: {
    id: string
    name: string
    comments: string
  }
  attachments: Attachment[]
}

export interface ReviewResultRequest {
  approved: boolean
  comments?: string
}

export interface GenerateReportResponse {
  id: string
  resultId: string
  registrationNo: string
  approvalNo: string      // 审批编号
  plantName: string       // 植物中名
  sampleNo: string       // 样品编号
  samplingLocation: string // 取样部位
  samplingQuantity: string // 取样数量
  samplingTime: string    // 取样时间
  sampler: string        // 取样人
  submissionTime: string  // 送检时间
  inspectionTime: string  // 检验时间
  method: string         // 检验方法
  findings: string       // 检验结果
  inspector: string      // 检验员
  labManager: string     // 实验室负责人
  date: string          // 日期
  fileName: string       // 报告文件名
  url: string           // 报告下载链接
} 