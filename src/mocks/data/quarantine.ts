import { ID, ISODate, QuarantineStatus, User, Attachment } from './types'

// 检疫场所
export interface QuarantineSite {
  id: ID
  name: string
  code: string
  type: 'NATIONAL' | 'REGIONAL' | 'LOCAL' | 'ENTERPRISE'
  supervisor: {
    id: ID
    name: string
    department: string
  }
  address: {
    province: string
    city: string
    district: string
    detail: string
    location: {
      latitude: number
      longitude: number
    }
  }
  contact: {
    name: string
    phone: string
  }
  capacity: {
    total: number
    used: number
  }
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: ISODate
  updatedAt: ISODate
}

// 检疫样品
export interface QuarantineSample {
  id: ID
  registrationNo: string
  applicationId: ID
  siteId: ID
  plantName: string
  scientificName: string
  variety: string
  sourceCountry: string
  quantity: string
  samplingInfo: {
    date: ISODate
    location: string
    inspector: User
    quantity: string
    method: string
  }
  status: QuarantineStatus
  currentLocation: {
    siteId: ID
    area: string
    position: string
  }
  attachments: Attachment[]
  createdAt: ISODate
  updatedAt: ISODate
}

// 示例数据
export const quarantineSites: QuarantineSite[] = [
  {
    id: '1',
    name: '北京植物隔离检疫场',
    code: 'BJ001',
    type: 'NATIONAL',
    supervisor: {
      id: '1',
      name: '张三',
      department: '北京海关'
    },
    address: {
      province: '北京市',
      city: '北京市',
      district: '大兴区',
      detail: '北京大兴国际机场附近',
      location: {
        latitude: 39.509,
        longitude: 116.410
      }
    },
    contact: {
      name: '李四',
      phone: '13800138000'
    },
    capacity: {
      total: 100,
      used: 45
    },
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '上海植物隔离检疫场',
    code: 'SH001',
    type: 'REGIONAL',
    supervisor: {
      id: '2',
      name: '王五',
      department: '上海海关'
    },
    address: {
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      detail: '浦东机场附近',
      location: {
        latitude: 31.143,
        longitude: 121.805
      }
    },
    contact: {
      name: '赵六',
      phone: '13900139000'
    },
    capacity: {
      total: 80,
      used: 30
    },
    status: 'ACTIVE',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
]

export const quarantineSamples: QuarantineSample[] = [
  {
    id: '1',
    registrationNo: 'BJ2024001',
    applicationId: '1',
    siteId: '1',
    plantName: '水稻',
    scientificName: 'Oryza sativa',
    variety: '日本晴',
    sourceCountry: '日本',
    quantity: '500g',
    samplingInfo: {
      date: '2024-02-15T10:00:00Z',
      location: '北京首都机场',
      inspector: {
        id: '3',
        name: '钱七',
        role: 'INSPECTOR',
        department: '北京海关'
      },
      quantity: '50g',
      method: '随机抽样'
    },
    status: 'IN_QUARANTINE',
    currentLocation: {
      siteId: '1',
      area: 'A区',
      position: 'A-12'
    },
    attachments: [
      {
        id: '1',
        name: '抽样记录表.pdf',
        url: '/files/sampling1.pdf',
        type: 'application/pdf',
        size: 1024000,
        uploadedAt: '2024-02-15T10:30:00Z',
        uploadedBy: {
          id: '3',
          name: '钱七',
          role: 'INSPECTOR',
          department: '北京海关'
        }
      }
    ],
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: '2',
    registrationNo: 'SH2024001',
    applicationId: '2',
    siteId: '2',
    plantName: '玉米',
    scientificName: 'Zea mays',
    variety: 'P3394',
    sourceCountry: '美国',
    quantity: '1kg',
    samplingInfo: {
      date: '2024-02-16T14:00:00Z',
      location: '上海浦东机场',
      inspector: {
        id: '4',
        name: '孙八',
        role: 'INSPECTOR',
        department: '上海海关'
      },
      quantity: '100g',
      method: '随机抽样'
    },
    status: 'REGISTERED',
    currentLocation: {
      siteId: '2',
      area: 'B区',
      position: 'B-08'
    },
    attachments: [
      {
        id: '2',
        name: '抽样记录表.pdf',
        url: '/files/sampling2.pdf',
        type: 'application/pdf',
        size: 1024000,
        uploadedAt: '2024-02-16T14:30:00Z',
        uploadedBy: {
          id: '4',
          name: '孙八',
          role: 'INSPECTOR',
          department: '上海海关'
        }
      }
    ],
    createdAt: '2024-02-16T14:00:00Z',
    updatedAt: '2024-02-16T14:30:00Z'
  }
] 