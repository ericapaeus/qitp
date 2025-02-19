export type TaskStatus = 'pending' | 'in_progress' | 'completed'
export type TaskPriority = 'high' | 'normal' | 'low'
export type ConclusionType = 'PASS' | 'FAIL' | 'NEED_PROCESS'
export type ReviewStatusType = 'PENDING' | 'APPROVED' | 'REJECTED'
export type InspectionMethod = 'visual' | 'microscope' | 'culture' | 'molecular'

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