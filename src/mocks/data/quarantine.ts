import { ID, ISODate, QuarantineStatus, User, Attachment } from './types'
import type { QuarantineSite, QuarantineSample } from '@/types/api/quarantine'

// 检疫场所数据
export const quarantineSites: QuarantineSite[] = [
  {
    id: 'SITE001',
    name: '温室A区',
    type: 'GREENHOUSE',
    capacity: 100,
    location: '北京市海淀区',
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SITE002',
    name: '实验室B区',
    type: 'LABORATORY',
    capacity: 50,
    location: '北京市海淀区',
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SITE003',
    name: '田间试验区C',
    type: 'FIELD',
    capacity: 200,
    location: '北京市昌平区',
    status: 'MAINTENANCE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// 检疫样品数据
export const quarantineSamples: QuarantineSample[] = [
  {
    id: 'SAMPLE001',
    siteId: 'SITE001',
    registrationNo: 'S202401001',
    plantName: '水稻',
    quantity: '500g',
    sourceCountry: '日本',
    status: 'REGISTERED',
    attachments: [
      {
        id: 'ATT001',
        name: '检疫证书.pdf',
        url: '/files/cert001.pdf',
        type: 'application/pdf',
        size: 1024000,
        uploadedAt: '2024-01-01T08:00:00Z'
      }
    ],
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'SAMPLE002',
    siteId: 'SITE001',
    registrationNo: 'S202401002',
    plantName: '玉米',
    quantity: '1kg',
    sourceCountry: '美国',
    status: 'IN_QUARANTINE',
    attachments: [],
    createdAt: '2024-01-02T09:00:00Z',
    updatedAt: '2024-01-02T09:00:00Z'
  },
  {
    id: 'SAMPLE003',
    siteId: 'SITE002',
    registrationNo: 'S202401003',
    plantName: '小麦',
    quantity: '800g',
    sourceCountry: '澳大利亚',
    status: 'COMPLETED',
    attachments: [
      {
        id: 'ATT002',
        name: '检疫报告.pdf',
        url: '/files/report001.pdf',
        type: 'application/pdf',
        size: 2048000,
        uploadedAt: '2024-01-03T10:00:00Z'
      },
      {
        id: 'ATT003',
        name: '实验数据.xlsx',
        url: '/files/data001.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 512000,
        uploadedAt: '2024-01-03T10:30:00Z'
      }
    ],
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:30:00Z'
  }
] 