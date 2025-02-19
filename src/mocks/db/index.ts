import { factory, primaryKey } from '@mswjs/data'
import { enterprises, importApplications } from '../data/enterprises'

// 创建模拟数据库
export const db = factory({
  // 企业模型
  enterprise: {
    id: primaryKey(String),
    code: String,
    name: String,
    contact: {
      address: String,
      person: String,
      phone: String,
    },
    status: String,
    syncTime: String,
    createdAt: String,
    updatedAt: String,
  },

  // 引种申请模型
  importApplication: {
    id: primaryKey(String),
    enterpriseId: String,
    approvalNo: String,
    quarantineCertNo: String,
    plant: {
      name: String,
      scientificName: String,
      variety: String,
      sourceCountry: String,
      quantity: Number,
      unit: String,
      purpose: String,
    },
    importInfo: {
      entryPort: String,
      plannedDate: String,
      actualDate: String,
    },
    isolationInfo: {
      facilityId: String,
      startDate: String,
      endDate: String,
    },
    reviewedAt: String,
    reviewer: String,
    reviewComments: String,
    reviewResult: String,
    quarantineRequired: Boolean,
    quarantineSite: String,
    quarantinePeriod: Number,
    status: String,
    createdAt: String,
    updatedAt: String,
  }
})

// 初始化数据
export function initializeDb() {
  // 清空数据
  db.enterprise.deleteMany({ where: {} })
  db.importApplication.deleteMany({ where: {} })

  // 添加企业数据
  enterprises.forEach(enterprise => {
    db.enterprise.create({
      ...enterprise,
      id: String(enterprise.id)
    })
  })

  // 添加引种申请数据
  importApplications.forEach(application => {
    db.importApplication.create({
      ...application,
      id: String(application.id)
    })
  })
}

// 清空数据
export function clearData() {
  db.enterprise.deleteMany({ where: {} })
  db.importApplication.deleteMany({ where: {} })
}

// 分页查询辅助函数
export function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return {
    items: items.slice(start, end),
    total: items.length,
    current: page,
  }
}

// 排序辅助函数
export function sort<T extends Record<string, any>>(
  items: T[],
  sortField?: string,
  sortOrder?: 'ascend' | 'descend'
) {
  if (!sortField || !sortOrder) return items

  return [...items].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (sortOrder === 'ascend') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    }
    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
  })
}

// 过滤辅助函数
export function filter<T>(items: T[], conditions: Record<string, any>) {
  return items.filter((item) => {
    return Object.entries(conditions).every(([key, value]) => {
      if (!value) return true

      const keys = key.split('.')
      let itemValue = item as any

      for (const k of keys) {
        itemValue = itemValue?.[k]
        if (itemValue === undefined) return false
      }

      if (typeof itemValue === 'string' && typeof value === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase())
      }

      return itemValue === value
    })
  })
} 