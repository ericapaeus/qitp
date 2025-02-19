import { NextRequest, NextResponse } from 'next/server'

/**
 * 基础类型定义
 */

// 通用标识符类型
export type ID = string

// ISO 日期字符串类型
export type ISODate = string

// 用户类型
export interface User {
  id: ID
  name: string
  role?: string
  department?: string
}

// 附件类型
export interface Attachment {
  id: ID
  name: string
  url: string
  type: string
  size: number
  uploadedAt: ISODate
  uploadedBy?: User
}

/**
 * 请求处理相关类型
 */

// 处理器函数类型
export type Handler = (
  request: NextRequest,
  params: Record<string, string>
) => Promise<NextResponse>

// 路由定义
export interface Route {
  method: string
  path: string
  handler: Handler
}

// API 响应格式
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
}

/**
 * 查询参数相关类型
 */

// 排序方向
export type SortOrder = 'ascend' | 'descend'

// 分页参数
export interface PaginationParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: SortOrder
}

// 日期范围参数
export interface DateRangeParams {
  startTime?: string
  endTime?: string
}

/**
 * 数据库相关类型
 */

// 数据库实体基础类型
export interface Entity {
  id: ID
  createdAt: ISODate
  updatedAt: ISODate
  [key: string]: any
}

// 数据库模型定义
export interface DatabaseModel {
  [key: string]: Entity[]
}

// 数据库操作接口
export interface Database {
  create<T extends Entity>(table: string, data: Omit<T, 'id'>): T
  findFirst<T extends Entity>(table: string, where: { id: string }): T | null
  findMany<T extends Entity>(table: string, where?: Record<string, any>): T[]
  update<T extends Entity>(table: string, where: { id: string }, data: Partial<T>): T | null
  delete(table: string, where: { id: string }): boolean
  count(table: string): number
}

/**
 * 业务状态类型
 */

// 检疫状态
export type QuarantineStatus = 'REGISTERED' | 'IN_QUARANTINE' | 'COMPLETED'

// 处理状态
export type ProcessStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

// 优先级
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' 