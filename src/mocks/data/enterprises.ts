import { ID, ISODate, ApprovalStatus, User } from './types'

// 企业信息
export interface Enterprise {
  id: ID
  name: string
  code: string
  address: {
    province: string
    city: string
    district: string
    detail: string
  }
  contact: {
    name: string
    phone: string
    email: string
  }
  business: {
    license: string
    expireDate: ISODate
  }
  createdAt: ISODate
  updatedAt: ISODate
}

// 引种申请
export interface ImportApplication {
  id: ID
  enterpriseId: ID
  applicationNo: string
  plantName: string
  scientificName: string
  variety: string
  sourceCountry: string
  quantity: string
  purpose: string
  importPort: string
  estimatedArrivalDate: ISODate
  quarantineSite: string
  attachments: Array<{
    id: ID
    type: 'LICENSE' | 'CERTIFICATE' | 'OTHER'
    name: string
    url: string
  }>
  status: ApprovalStatus
  review?: {
    reviewedAt: ISODate
    reviewer: User
    comments: string
    result: 'APPROVED' | 'REJECTED'
    quarantineRequired: boolean
    quarantineSite?: string
    quarantinePeriod?: number
  }
  createdAt: ISODate
  updatedAt: ISODate
}

// 示例数据
export const enterprises: Enterprise[] = [
  {
    id: '1',
    name: '北京农业科技发展有限公司',
    code: 'BJ20240001',
    address: {
      province: '北京市',
      city: '北京市',
      district: '海淀区',
      detail: '中关村科技园区23号'
    },
    contact: {
      name: '张三',
      phone: '13800138000',
      email: 'zhangsan@example.com'
    },
    business: {
      license: '91110108MA12345678',
      expireDate: '2025-12-31'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '上海现代农业有限公司',
    code: 'SH20240001',
    address: {
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      detail: '张江高科技园区45号'
    },
    contact: {
      name: '李四',
      phone: '13900139000',
      email: 'lisi@example.com'
    },
    business: {
      license: '91310115MA87654321',
      expireDate: '2026-12-31'
    },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
]

export const importApplications: ImportApplication[] = [
  {
    id: '1',
    enterpriseId: '1',
    applicationNo: 'IA202402001',
    plantName: '水稻',
    scientificName: 'Oryza sativa',
    variety: '日本晴',
    sourceCountry: '日本',
    quantity: '500g',
    purpose: '科研育种',
    importPort: '北京首都机场',
    estimatedArrivalDate: '2024-03-01',
    quarantineSite: '北京植物隔离检疫场',
    attachments: [
      {
        id: '1',
        type: 'LICENSE',
        name: '营业执照.pdf',
        url: '/files/license.pdf'
      },
      {
        id: '2',
        type: 'CERTIFICATE',
        name: '植物检疫证书.pdf',
        url: '/files/certificate.pdf'
      }
    ],
    status: 'PENDING',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '2',
    enterpriseId: '2',
    applicationNo: 'IA202402002',
    plantName: '玉米',
    scientificName: 'Zea mays',
    variety: 'P3394',
    sourceCountry: '美国',
    quantity: '1kg',
    purpose: '商业育种',
    importPort: '上海浦东机场',
    estimatedArrivalDate: '2024-03-15',
    quarantineSite: '上海植物隔离检疫场',
    attachments: [
      {
        id: '3',
        type: 'LICENSE',
        name: '营业执照.pdf',
        url: '/files/license2.pdf'
      },
      {
        id: '4',
        type: 'CERTIFICATE',
        name: '植物检疫证书.pdf',
        url: '/files/certificate2.pdf'
      }
    ],
    status: 'APPROVED',
    review: {
      reviewedAt: '2024-02-10T10:00:00Z',
      reviewer: {
        id: '1',
        name: '王五',
        role: 'REVIEWER',
        department: '检疫审批部'
      },
      comments: '申请材料完整，符合要求',
      result: 'APPROVED',
      quarantineRequired: true,
      quarantineSite: '上海植物隔离检疫场',
      quarantinePeriod: 30
    },
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z'
  }
] 