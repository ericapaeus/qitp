import { apiConfig, generateCacheKey, handleApiResponse, handleApiError, APIResponse } from '@/config/api'

// 内存缓存
const cache = new Map<string, { data: any; timestamp: number }>()

// 清理过期缓存
function cleanExpiredCache() {
  const now = Date.now()
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > apiConfig.cache.ttl) {
      cache.delete(key)
    }
  }
}

// 定期清理缓存
setInterval(cleanExpiredCache, apiConfig.cache.ttl)

// 基础请求函数
async function request<T>(
  path: string,
  options: RequestInit & {
    params?: Record<string, any>
    useCache?: boolean
  } = {}
): Promise<T> {
  try {
    const { params, useCache = apiConfig.cache.enable, ...init } = options
    
    // 构建请求 URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : apiConfig.baseURL
    const url = new URL(path, baseUrl)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    // 检查缓存
    if (useCache) {
      const cacheKey = generateCacheKey(url.toString(), init.body ? JSON.parse(init.body as string) : undefined)
      const cached = cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < apiConfig.cache.ttl) {
        return cached.data
      }
    }

    // 发送请求
    const response = await fetch(url.toString(), {
      ...init,
      headers: {
        ...apiConfig.headers,
        ...init.headers
      }
    })

    // 处理响应
    const data = await handleApiResponse<T>(response)

    // 更新缓存
    if (useCache) {
      const cacheKey = generateCacheKey(url.toString(), init.body ? JSON.parse(init.body as string) : undefined)
      if (cache.size >= apiConfig.cache.maxSize) {
        const oldestKey = cache.keys().next().value
        if (oldestKey) {
          cache.delete(oldestKey)
        }
      }
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      })
    }

    return data
  } catch (error) {
    handleApiError(error)
  }
}

// GET 请求
export function get<T>(path: string, params?: Record<string, any>, options?: Omit<RequestInit, 'method'> & { useCache?: boolean }) {
  return request<T>(path, {
    method: 'GET',
    params,
    ...options
  })
}

// POST 请求
export function post<T>(path: string, data?: any, options?: Omit<RequestInit, 'method' | 'body'>) {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
    useCache: false
  })
}

// PUT 请求
export function put<T>(path: string, data?: any, options?: Omit<RequestInit, 'method' | 'body'>) {
  return request<T>(path, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
    useCache: false
  })
}

// PATCH 请求
export function patch<T>(path: string, data?: any, options?: Omit<RequestInit, 'method' | 'body'>) {
  return request<T>(path, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options,
    useCache: false
  })
}

// DELETE 请求
export function del<T>(path: string, options?: Omit<RequestInit, 'method'>) {
  return request<T>(path, {
    method: 'DELETE',
    ...options,
    useCache: false
  })
}

// 批量请求
export async function batch<T extends Promise<any>>(requests: Array<() => T>): Promise<Awaited<T>[]> {
  try {
    return await Promise.all(requests.map(request => request()))
  } catch (error) {
    handleApiError(error)
  }
}

// 取消缓存
export function invalidateCache(path?: string) {
  if (path) {
    for (const key of cache.keys()) {
      if (key.startsWith(path)) {
        cache.delete(key)
      }
    }
  } else {
    cache.clear()
  }
}

// 预加载数据
export function preload<T>(path: string, params?: Record<string, any>) {
  return get<T>(path, params, { useCache: true })
}

// 导出工具函数
export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
  batch,
  invalidateCache,
  preload
} 