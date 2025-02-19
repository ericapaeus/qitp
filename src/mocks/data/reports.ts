import { ID, ISODate, ProcessMethod, User, Attachment } from './types'

// 处理决定通知书
export interface ProcessDecision {
  id: ID
  registrationNo: string
  sampleId: ID
  resultId: ID
  documentNo: string
  enterprise: {
    id: ID
    name: string
  }
  plant: {
    name: string
    scientificName: string
    variety: string
    quantity: string
    sourceCountry: string
  }
  quarantine: {
    site: {
      id: ID
      name: string
    }
    period: {
      startDate: ISODate
      endDate: ISODate
    }
  }
  findings: Array<{
    id: ID
    type: string
    name: string
    description: string
    stage: 'INITIAL' | 'QUARANTINE'
  }>
  process: {
    method: ProcessMethod
    details: string
  }
  status: 'DRAFT' | 'ISSUED' | 'PROCESSED'
  issuedBy?: User
  issuedAt?: ISODate
  attachments: Attachment[]
  createdAt: ISODate
  updatedAt: ISODate
}

// 处理报告
export interface ProcessReport {
  id: ID
  decisionId: ID
  documentNo: string
  registrationNo: string
  enterprise: {
    id: ID
    name: string
  }
  plant: {
    name: string
    scientificName: string
  }
  findings: Array<{
    id: ID
    type: string
    name: string
    description: string
  }>
  process: {
    method: ProcessMethod
    quantity: string
    date: ISODate
    result: string
  }
  inspector: User
  attachments: Attachment[]
  createdAt: ISODate
  updatedAt: ISODate
}

// 检疫放行证书
export interface QuarantineRelease {
  id: ID
  documentNo: string
  registrationNo: string
  enterprise: {
    id: ID
    name: string
  }
  plant: {
    name: string
    scientificName: string
    variety: string
    quantity: string
    sourceCountry: string
  }
  quarantine: {
    site: {
      id: ID
      name: string
    }
    period: {
      startDate: ISODate
      endDate: ISODate
    }
  }
  result: {
    type: 'HEALTHY' | 'PROCESSED' | 'DETOXIFIED'
    findings?: Array<{
      id: ID
      type: string
      name: string
      description: string
    }>
    process?: {
      method: ProcessMethod
      details: string
    }
  }
  issuedBy: User
  issuedAt: ISODate
  attachments: Attachment[]
  createdAt: ISODate
  updatedAt: ISODate
}

// 示例数据
export const processDecisions: ProcessDecision[] = [
  {
    id: '1',
    registrationNo: 'BJ2024001',
    sampleId: '1',
    resultId: '1',
    documentNo: 'PD202402001',
    enterprise: {
      id: '1',
      name: '北京农业科技发展有限公司'
    },
    plant: {
      name: '水稻',
      scientificName: 'Oryza sativa',
      variety: '日本晴',
      quantity: '500g',
      sourceCountry: '日本'
    },
    quarantine: {
      site: {
        id: '1',
        name: '北京植物隔离检疫场'
      },
      period: {
        startDate: '2024-02-15T00:00:00Z',
        endDate: '2024-03-15T00:00:00Z'
      }
    },
    findings: [
      {
        id: '1',
        type: '真菌',
        name: '稻瘟病菌',
        description: '在叶片组织中发现稻瘟病菌孢子，密度较高',
        stage: 'QUARANTINE'
      }
    ],
    process: {
      method: 'STERILIZE',
      details: '使用农药进行除害处理'
    },
    status: 'ISSUED',
    issuedBy: {
      id: '8',
      name: '陈十二',
      role: 'SUPERVISOR',
      department: '北京植物检疫实验室'
    },
    issuedAt: '2024-02-15T16:00:00Z',
    attachments: [
      {
        id: '1',
        name: '处理决定通知书.pdf',
        url: '/files/decision1.pdf',
        type: 'application/pdf',
        size: 1024000,
        uploadedAt: '2024-02-15T16:00:00Z',
        uploadedBy: {
          id: '8',
          name: '陈十二',
          role: 'SUPERVISOR',
          department: '北京植物检疫实验室'
        }
      }
    ],
    createdAt: '2024-02-15T15:00:00Z',
    updatedAt: '2024-02-15T16:00:00Z'
  }
]

export const processReports: ProcessReport[] = [
  {
    id: '1',
    decisionId: '1',
    documentNo: 'PR202402001',
    registrationNo: 'BJ2024001',
    enterprise: {
      id: '1',
      name: '北京农业科技发展有限公司'
    },
    plant: {
      name: '水稻',
      scientificName: 'Oryza sativa'
    },
    findings: [
      {
        id: '1',
        type: '真菌',
        name: '稻瘟病菌',
        description: '在叶片组织中发现稻瘟病菌孢子，密度较高'
      }
    ],
    process: {
      method: 'STERILIZE',
      quantity: '500g',
      date: '2024-02-16T10:00:00Z',
      result: '处理后未发现活体病菌'
    },
    inspector: {
      id: '6',
      name: '吴十',
      role: 'INSPECTOR',
      department: '北京植物检疫实验室'
    },
    attachments: [
      {
        id: '1',
        name: '处理报告.pdf',
        url: '/files/report1.pdf',
        type: 'application/pdf',
        size: 1024000,
        uploadedAt: '2024-02-16T11:00:00Z',
        uploadedBy: {
          id: '6',
          name: '吴十',
          role: 'INSPECTOR',
          department: '北京植物检疫实验室'
        }
      }
    ],
    createdAt: '2024-02-16T10:00:00Z',
    updatedAt: '2024-02-16T11:00:00Z'
  }
]

export const quarantineReleases: QuarantineRelease[] = [
  {
    id: '1',
    documentNo: 'QR202402001',
    registrationNo: 'BJ2024001',
    enterprise: {
      id: '1',
      name: '北京农业科技发展有限公司'
    },
    plant: {
      name: '水稻',
      scientificName: 'Oryza sativa',
      variety: '日本晴',
      quantity: '500g',
      sourceCountry: '日本'
    },
    quarantine: {
      site: {
        id: '1',
        name: '北京植物隔离检疫场'
      },
      period: {
        startDate: '2024-02-15T00:00:00Z',
        endDate: '2024-03-15T00:00:00Z'
      }
    },
    result: {
      type: 'PROCESSED',
      findings: [
        {
          id: '1',
          type: '真菌',
          name: '稻瘟病菌',
          description: '在叶片组织中发现稻瘟病菌孢子，密度较高'
        }
      ],
      process: {
        method: 'STERILIZE',
        details: '使用农药进行除害处理，处理后未发现活体病菌'
      }
    },
    issuedBy: {
      id: '8',
      name: '陈十二',
      role: 'SUPERVISOR',
      department: '北京植物检疫实验室'
    },
    issuedAt: '2024-02-16T14:00:00Z',
    attachments: [
      {
        id: '1',
        name: '检疫放行证书.pdf',
        url: '/files/release1.pdf',
        type: 'application/pdf',
        size: 1024000,
        uploadedAt: '2024-02-16T14:00:00Z',
        uploadedBy: {
          id: '8',
          name: '陈十二',
          role: 'SUPERVISOR',
          department: '北京植物检疫实验室'
        }
      }
    ],
    createdAt: '2024-02-16T13:00:00Z',
    updatedAt: '2024-02-16T14:00:00Z'
  }
] 