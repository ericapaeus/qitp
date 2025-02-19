import type { Entity, DatabaseModel, Database, SortOrder } from '../types'
import { enterprises, importApplications } from '../data/enterprises'
import { quarantineSites, quarantineSamples } from '../data/quarantine'

// 内存数据库
const db: DatabaseModel = {
  enterprise: [],
  importApplication: [],
  quarantineSite: [],
  quarantineSample: [],
  quarantineTask: [],
  isolationTask: [],
  laboratoryTask: [],
  report: []
}

// 数据库操作实现
export const database: Database = {
  // 创建记录
  create<T extends Entity>(table: string, data: Omit<T, 'id'>): T {
    const record = {
      id: Date.now().toString(),
      ...data
    } as T
    db[table].push(record)
    return record
  },

  // 查找单条记录
  findFirst<T extends Entity>(table: string, where: { id: string }): T | null {
    return db[table].find(record => record.id === where.id) as T || null
  },

  // 查找多条记录
  findMany<T extends Entity>(table: string, where?: Record<string, any>): T[] {
    let records = db[table] as T[]
    if (where) {
      records = filter(records, where)
    }
    return records
  },

  // 更新记录
  update<T extends Entity>(table: string, where: { id: string }, data: Partial<T>): T | null {
    const index = db[table].findIndex(record => record.id === where.id)
    if (index === -1) return null
    const record = db[table][index]
    db[table][index] = { ...record, ...data }
    return db[table][index] as T
  },

  // 删除记录
  delete(table: string, where: { id: string }): boolean {
    const index = db[table].findIndex(record => record.id === where.id)
    if (index === -1) return false
    db[table].splice(index, 1)
    return true
  },

  // 获取记录数量
  count(table: string): number {
    return db[table].length
  }
}

// 工具函数：过滤
export function filter<T extends Record<string, any>>(
  items: T[],
  conditions: Record<string, any>
): T[] {
  return items.filter(item => {
    return Object.entries(conditions).every(([key, value]) => {
      if (!value) return true
      const itemValue = key.includes('.')
        ? key.split('.').reduce((obj, k) => obj?.[k], item)
        : item[key]
      return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
    })
  })
}

// 工具函数：排序
export function sort<T extends Record<string, any>>(
  items: T[],
  field?: string,
  order?: SortOrder
): T[] {
  if (!field || !order) return items
  return [...items].sort((a, b) => {
    const aValue = field.includes('.')
      ? field.split('.').reduce((obj, key) => obj?.[key], a)
      : a[field]
    const bValue = field.includes('.')
      ? field.split('.').reduce((obj, key) => obj?.[key], b)
      : b[field]
    const comparison = String(aValue).localeCompare(String(bValue))
    return order === 'ascend' ? comparison : -comparison
  })
}

// 工具函数：分页
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): {
  items: T[]
  total: number
  current: number
} {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    items: items.slice(start, end),
    total: items.length,
    current: page,
  }
}

// 初始化数据
export function initializeDb() {
  // 清空数据
  Object.keys(db).forEach(table => {
    db[table] = []
  })

  // 添加企业数据
  enterprises.forEach(enterprise => {
    db.enterprise.push(enterprise)
  })

  // 添加引种申请数据
  importApplications.forEach(application => {
    db.importApplication.push(application)
  })

  // 添加检疫场所数据
  quarantineSites.forEach(site => {
    db.quarantineSite.push(site)
  })

  // 添加检疫样品数据
  quarantineSamples.forEach(sample => {
    db.quarantineSample.push(sample)
  })
}

// 导出数据库实例
export { db } 