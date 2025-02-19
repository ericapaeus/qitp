export * from './types'
export * from './enterprises'
export * from './quarantine'
export * from './isolation'
export * from './laboratory'
export * from './reports'

import { db } from '../db'

// 创建初始企业数据
const enterprises = [
  {
    id: '1',
    code: 'E000001',
    name: '示例企业一',
    contact: {
      address: '北京市海淀区中关村大街1号',
      person: '张三',
      phone: '13800138001',
    },
    status: 'ACTIVE',
    syncTime: '2024-03-20T08:00:00Z',
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-03-20T08:00:00Z',
  },
  {
    id: '2',
    code: 'E000002',
    name: '示例企业二',
    contact: {
      address: '上海市浦东新区张江高科技园区',
      person: '李四',
      phone: '13800138002',
    },
    status: 'ACTIVE',
    syncTime: '2024-03-20T08:00:00Z',
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-03-20T08:00:00Z',
  },
  {
    id: '3',
    code: 'E000003',
    name: '示例企业三',
    contact: {
      address: '广州市天河区珠江新城',
      person: '王五',
      phone: '13800138003',
    },
    status: 'SUSPENDED',
    syncTime: '2024-03-20T08:00:00Z',
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-03-20T08:00:00Z',
  },
]

// 创建初始引种记录数据
const importRecords = [
  {
    id: '1',
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
    status: 'PENDING',
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-03-20T08:00:00Z',
  },
  {
    id: '2',
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
    status: 'PENDING',
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-03-20T08:00:00Z',
  },
]

// 初始化数据
export function initializeData() {
  // 添加企业数据
  enterprises.forEach((enterprise) => {
    const existingEnterprise = db.enterprise.findFirst({
      where: { id: { equals: enterprise.id } },
    })
    if (!existingEnterprise) {
      db.enterprise.create(enterprise)
    }
  })

  // 添加引种记录数据
  importRecords.forEach((record) => {
    const existingRecord = db.importApplication.findFirst({
      where: { id: { equals: record.id } },
    })
    if (!existingRecord) {
      db.importApplication.create(record)
    }
  })
}

// 自动初始化数据
initializeData() 