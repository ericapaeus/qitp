import { useState, useCallback, useEffect } from 'react'
import { handleApiError } from '@/lib/utils'

interface RequestOptions<T> {
  // 初始数据
  initialData?: T
  // 是否自动加载
  autoLoad?: boolean
  // 依赖项
  deps?: any[]
  // 成功回调
  onSuccess?: (data: T) => void
  // 错误回调
  onError?: (error: string) => void
}

/**
 * 通用的数据请求 hook
 * @param requestFn 请求函数
 * @param options 配置选项
 */
export function useRequest<T>(
  requestFn: (...args: any[]) => Promise<T>,
  options: RequestOptions<T> = {}
) {
  const {
    initialData,
    autoLoad = true,
    deps = [],
    onSuccess,
    onError,
  } = options

  const [data, setData] = useState<T | undefined>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (...args: any[]) => {
    try {
      setLoading(true)
      setError(null)
      const result = await requestFn(...args)
      setData(result)
      onSuccess?.(result)
      return result
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      onError?.(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [requestFn, onSuccess, onError])

  useEffect(() => {
    if (autoLoad) {
      execute()
    }
  }, [autoLoad, execute, ...deps])

  const refresh = useCallback(() => {
    return execute()
  }, [execute])

  return {
    data,
    loading,
    error,
    execute,
    refresh,
  }
}

/**
 * 分页数据请求 hook
 * @param requestFn 请求函数
 * @param options 配置选项
 */
export function usePaginatedRequest<T>(
  requestFn: (params: { page: number; pageSize: number }) => Promise<{ items: T[]; total: number }>,
  options: RequestOptions<{ items: T[]; total: number }> & {
    defaultPageSize?: number
  } = {}
) {
  const { defaultPageSize = 10, ...restOptions } = options
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  const {
    data,
    loading,
    error,
    execute,
    refresh,
  } = useRequest(
    () => requestFn({ page, pageSize }),
    {
      ...restOptions,
      deps: [...(restOptions.deps || []), page, pageSize],
    }
  )

  const changePage = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
  }, [])

  return {
    data: data?.items || [],
    total: data?.total || 0,
    loading,
    error,
    page,
    pageSize,
    changePage,
    changePageSize,
    refresh,
  }
} 