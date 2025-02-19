// 基础类型定义
export type ID = string
export type Timestamp = string
export type ISODate = string

// 审批状态
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// 检疫状态
export type QuarantineStatus = 
  | 'REGISTERED'      // 已登记
  | 'IN_QUARANTINE'   // 隔离中
  | 'COMPLETED'       // 已完成
  | 'DESTROYED'       // 已销毁

// 检验方法
export type InspectionMethod = 
  | 'VISUAL'      // 目视检查
  | 'MICROSCOPE'  // 显微镜检查
  | 'CULTURE'     // 培养检查
  | 'MOLECULAR'   // 分子检测

// 检验结论
export type InspectionConclusion = 
  | 'PASS'           // 合格
  | 'FAIL'           // 不合格
  | 'NEED_PROCESS'   // 需处理

// 处理方式
export type ProcessMethod = 
  | 'DESTROY'    // 销毁
  | 'STERILIZE'  // 除害
  | 'DETOX'      // 脱毒

// 基础用户信息
export interface User {
  id: ID
  name: string
  role: string
  department: string
}

// 文件附件
export interface Attachment {
  id: ID
  name: string
  url: string
  type: string
  size: number
  uploadedAt: Timestamp
  uploadedBy: User
}

// 审核信息
export interface Review {
  id: ID
  reviewedAt: Timestamp
  reviewer: User
  status: ApprovalStatus
  comments?: string
}

// 环境数据
export interface EnvironmentData {
  id: ID
  timestamp: Timestamp
  temperature: number
  humidity: number
  light: number
  location: string
}

// 告警信息
export interface Alert {
  id: ID
  title: string
  description: string
  level: 'INFO' | 'WARNING' | 'ERROR'
  timestamp: Timestamp
  isRead: boolean
  source: string
  relatedId?: ID
}

// 时间线事件
export interface TimelineEvent {
  id: ID
  type: 'SAMPLE' | 'INSPECTION' | 'ENVIRONMENT' | 'PROCESS'
  title: string
  description: string
  timestamp: Timestamp
  status: 'SUCCESS' | 'WARNING' | 'ERROR'
  relatedId?: ID
}

// 统计数据
export interface Statistics {
  activeSamples: {
    value: number
    trend: string
    trendType: 'UP' | 'DOWN'
  }
  abnormalCount: {
    value: number
    trend: string
    trendType: 'UP' | 'DOWN'
    status: 'SUCCESS' | 'WARNING' | 'ERROR'
  }
  pendingTasks: {
    value: number
    trend: string
    trendType: 'UP' | 'DOWN'
  }
  completionRate: {
    value: string
    trend: string
    trendType: 'UP' | 'DOWN'
    status: 'SUCCESS' | 'WARNING' | 'ERROR'
  }
} 