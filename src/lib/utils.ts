import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 className，支持 Tailwind CSS 类名合并
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化日期
 * @param date 日期对象或字符串
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间，单位毫秒
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: NodeJS.Timeout
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

/**
 * 节流函数
 * @param fn 需要节流的函数
 * @param limit 时间限制，单位毫秒
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number) {
  let inThrottle: boolean
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * 深拷贝对象
 * @param obj 需要拷贝的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj) as any
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any
  if (obj instanceof Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
    ) as any
  }
  return obj
}

/**
 * 检查权限
 * @param userPermissions 用户权限列表
 * @param requiredPermissions 需要的权限列表
 * @param mode 检查模式：'every' 需要满足所有权限，'some' 满足任一权限即可
 */
export function checkPermissions(
  userPermissions: string[],
  requiredPermissions: string[],
  mode: 'every' | 'some' = 'every'
): boolean {
  if (!requiredPermissions.length) return true
  if (!userPermissions.length) return false
  return mode === 'every'
    ? requiredPermissions.every(p => userPermissions.includes(p))
    : requiredPermissions.some(p => userPermissions.includes(p))
}

/**
 * 处理 API 错误
 * @param error 错误对象
 */
export function handleApiError(error: any): string {
  if (typeof error === 'string') return error
  if (error.response?.data?.message) return error.response.data.message
  if (error.message) return error.message
  return '未知错误'
}

/**
 * 获取嵌套对象的值
 * @param obj 目标对象
 * @param path 属性路径，可以是字符串或字符串数组
 * @returns 属性值
 */
export function getNestedValue(obj: any, path: string | string[]): any {
  const keys = Array.isArray(path) ? path : path.split('.')
  return keys.reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}
