export * from './types'
export * from './enterprises'
export * from './quarantine'
export * from './isolation'
export * from './laboratory'
export * from './reports'

import { database } from '../db'
import type { Enterprise, ImportApplication, ImportRecord } from '@/types/api/enterprises'

// 创建初始企业数据
const enterprises: Omit<Enterprise, 'id'>[] = [
  {
    code: 'E000001',
    name: '示例企业一',
    contact: {
      address: '北京市海淀区中关村大街1号',
      person: '张三',
      phone: '13800138001',
    },
    status: 'ACTIVE' as const,
    syncTime: '2024-03-20T08:00:00Z',
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-03-20T08:00:00Z',
  },
  {
    code: 'E000002',
    name: '示例企业二',
    contact: {
      address: '上海市浦东新区张江高科技园区',
      person: '李四',
      phone: '13800138002',
    },
    status: 'ACTIVE' as const,
    syncTime: '2024-03-20T08:00:00Z',
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-03-20T08:00:00Z',
  },
  {
    code: 'E000003',
    name: '示例企业三',
    contact: {
      address: '广州市天河区珠江新城',
      person: '王五',
      phone: '13800138003',
    },
    status: 'SUSPENDED' as const,
    syncTime: '2024-03-20T08:00:00Z',
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-03-20T08:00:00Z',
  },
]

// 创建初始引种申请数据
const importRecords: Omit<ImportRecord, 'id'>[] = [
  {
    enterpriseId: '1',
    approvalNo: 'IM202403001',
    quarantineCertNo: 'QC202403001',
    plant: {
      name: '玫瑰',
      scientificName: 'Rosa',
      variety: '红玫瑰',
      sourceCountry: '荷兰',
      quantity: 1000,
      unit: '株',
      purpose: '种植',
    },
    importInfo: {
      entryPort: '上海港',
      plannedDate: '2024-04-01',
      actualDate: '',
    },
    isolationInfo: {
      facilityId: 'F001',
      startDate: '',
      endDate: '',
    },
    status: 'IMPORTING' as const,
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-03-20T08:00:00Z',
  },
  {
    enterpriseId: '2',
    approvalNo: 'IM202403002',
    quarantineCertNo: '',
    plant: {
      name: '兰花',
      scientificName: 'Orchidaceae',
      variety: '蝴蝶兰',
      sourceCountry: '泰国',
      quantity: 500,
      unit: '株',
      purpose: '种植',
    },
    importInfo: {
      entryPort: '广州港',
      plannedDate: '2024-04-15',
      actualDate: '',
    },
    isolationInfo: {
      facilityId: '',
      startDate: '',
      endDate: '',
    },
    status: 'ISOLATING' as const,
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-03-20T08:00:00Z',
  },
]

// 初始化数据
export function initializeData() {
  // 添加企业数据
  enterprises.forEach((enterprise, index) => {
    const id = String(index + 1)
    const existingEnterprise = database.findFirst<Enterprise>('enterprise', { id })
    if (!existingEnterprise) {
      database.create<Enterprise>('enterprise', enterprise)
    }
  })

  // 添加引种记录数据
  importRecords.forEach((record, index) => {
    const id = String(index + 1)
    const existingRecord = database.findFirst<ImportRecord>('importRecord', { id })
    if (!existingRecord) {
      database.create<ImportRecord>('importRecord', record)
    }
  })
}

// 自动初始化数据
initializeData() 