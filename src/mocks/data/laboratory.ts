import { ID, ISODate, InspectionMethod, InspectionConclusion, User, Attachment } from './types'

// 实验室任务
export interface LaboratoryTask {
  id: ID
  registrationNo: string
  sampleId: ID
  plantName: string
  symptom: string
  samplingDate: ISODate
  priority: 'HIGH' | 'NORMAL' | 'LOW'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  inspector: User | null
  createdAt: ISODate
  updatedAt: ISODate
}

// 检验结果
export interface InspectionResult {
  id: ID
  taskId: ID
  registrationNo: string
  plantName: string
  symptom: string
  inspectionDate: ISODate
  inspector: User
  method: InspectionMethod
  findings: Array<{
    id: ID
    type: string
    name: string
    description: string
    level: 'HIGH' | 'MEDIUM' | 'LOW'
  }>
  conclusion: InspectionConclusion
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewer?: {
    reviewedAt: ISODate
    reviewer: User
    comments: string
  }
  attachments: Attachment[]
  createdAt: ISODate
  updatedAt: ISODate
}

// 示例数据
export const laboratoryTasks: LaboratoryTask[] = [
  {
    id: '1',
    registrationNo: 'BJ2024001',
    sampleId: '1',
    plantName: '水稻',
    symptom: '叶片出现褐色斑点，疑似真菌感染',
    samplingDate: '2024-02-15T10:00:00Z',
    priority: 'HIGH',
    status: 'PENDING',
    inspector: null,
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: '2',
    registrationNo: 'SH2024001',
    sampleId: '2',
    plantName: '玉米',
    symptom: '茎秆基部变色，生长受阻',
    samplingDate: '2024-02-16T14:00:00Z',
    priority: 'NORMAL',
    status: 'IN_PROGRESS',
    inspector: {
      id: '5',
      name: '周九',
      role: 'INSPECTOR',
      department: '上海植物检疫实验室'
    },
    createdAt: '2024-02-16T14:30:00Z',
    updatedAt: '2024-02-16T15:00:00Z'
  }
]

export const inspectionResults: InspectionResult[] = [
  {
    id: '1',
    taskId: '1',
    registrationNo: 'BJ2024001',
    plantName: '水稻',
    symptom: '叶片出现褐色斑点，疑似真菌感染',
    inspectionDate: '2024-02-15T14:00:00Z',
    inspector: {
      id: '6',
      name: '吴十',
      role: 'INSPECTOR',
      department: '北京植物检疫实验室'
    },
    method: 'MICROSCOPE',
    findings: [
      {
        id: '1',
        type: '真菌',
        name: '稻瘟病菌',
        description: '在叶片组织中发现稻瘟病菌孢子，密度较高',
        level: 'HIGH'
      }
    ],
    conclusion: 'NEED_PROCESS',
    reviewStatus: 'PENDING',
    attachments: [
      {
        id: '1',
        name: '显微镜照片1.jpg',
        url: '/files/microscope1.jpg',
        type: 'image/jpeg',
        size: 2048000,
        uploadedAt: '2024-02-15T14:30:00Z',
        uploadedBy: {
          id: '6',
          name: '吴十',
          role: 'INSPECTOR',
          department: '北京植物检疫实验室'
        }
      },
      {
        id: '2',
        name: '检验记录.pdf',
        url: '/files/inspection1.pdf',
        type: 'application/pdf',
        size: 1024000,
        uploadedAt: '2024-02-15T14:30:00Z',
        uploadedBy: {
          id: '6',
          name: '吴十',
          role: 'INSPECTOR',
          department: '北京植物检疫实验室'
        }
      }
    ],
    createdAt: '2024-02-15T14:00:00Z',
    updatedAt: '2024-02-15T14:30:00Z'
  },
  {
    id: '2',
    taskId: '2',
    registrationNo: 'SH2024001',
    plantName: '玉米',
    symptom: '茎秆基部变色，生长受阻',
    inspectionDate: '2024-02-16T16:00:00Z',
    inspector: {
      id: '5',
      name: '周九',
      role: 'INSPECTOR',
      department: '上海植物检疫实验室'
    },
    method: 'CULTURE',
    findings: [
      {
        id: '2',
        type: '细菌',
        name: '青枯病菌',
        description: '分离培养发现青枯病菌，菌落特征明显',
        level: 'HIGH'
      }
    ],
    conclusion: 'FAIL',
    reviewStatus: 'APPROVED',
    reviewer: {
      reviewedAt: '2024-02-16T17:00:00Z',
      reviewer: {
        id: '7',
        name: '郑十一',
        role: 'REVIEWER',
        department: '上海植物检疫实验室'
      },
      comments: '检验结果准确，建议按处理方案执行'
    },
    attachments: [
      {
        id: '3',
        name: '培养皿照片.jpg',
        url: '/files/culture1.jpg',
        type: 'image/jpeg',
        size: 2048000,
        uploadedAt: '2024-02-16T16:30:00Z',
        uploadedBy: {
          id: '5',
          name: '周九',
          role: 'INSPECTOR',
          department: '上海植物检疫实验室'
        }
      },
      {
        id: '4',
        name: '检验报告.pdf',
        url: '/files/inspection2.pdf',
        type: 'application/pdf',
        size: 1024000,
        uploadedAt: '2024-02-16T16:30:00Z',
        uploadedBy: {
          id: '5',
          name: '周九',
          role: 'INSPECTOR',
          department: '上海植物检疫实验室'
        }
      }
    ],
    createdAt: '2024-02-16T16:00:00Z',
    updatedAt: '2024-02-16T17:00:00Z'
  }
] 