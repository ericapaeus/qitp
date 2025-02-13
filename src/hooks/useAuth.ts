import { useCallback, useEffect, useState } from 'react'
import { UserInfo } from '@/types/common'

/**
 * 认证相关的 hook
 */
export function useAuth() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取用户信息
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      // TODO: 调用实际的 API
      const mockUser: UserInfo = {
        id: '1',
        username: 'admin',
        role: 'ADMIN',
        permissions: ['*'],
      }
      setUser(mockUser)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取用户信息失败')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // 登录
  const login = useCallback(async (username: string, password: string) => {
    try {
      setLoading(true)
      // TODO: 调用实际的登录 API
      await new Promise(resolve => setTimeout(resolve, 1000))
      await fetchUser()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchUser])

  // 登出
  const logout = useCallback(async () => {
    try {
      setLoading(true)
      // TODO: 调用实际的登出 API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUser(null)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '登出失败')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // 检查权限
  const checkPermission = useCallback((permission: string | string[]) => {
    if (!user) return false
    const permissions = Array.isArray(permission) ? permission : [permission]
    return user.permissions.includes('*') || 
      permissions.every(p => user.permissions.includes(p))
  }, [user])

  // 初始化时获取用户信息
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkPermission,
  }
} 