import { Enterprise, SyncResult } from '@/types/api/enterprises'

/**
 * 同步企业数据
 */
export async function syncEnterprises(): Promise<SyncResult> {
  const response = await fetch('/api/enterprises/sync', {
    method: 'POST',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '同步失败')
  }

  return response.json()
}

/**
 * 获取企业列表
 */
export async function getEnterprises(params: {
  keyword?: string
  status?: string
  page?: number
  pageSize?: number
}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.append(key, String(value))
  })

  const response = await fetch(`/api/enterprises?${searchParams.toString()}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '获取企业列表失败')
  }

  return response.json()
}

/**
 * 获取企业详情
 */
export async function getEnterprise(id: string): Promise<Enterprise> {
  const response = await fetch(`/api/enterprises/${id}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '获取企业详情失败')
  }

  return response.json()
}

/**
 * 更新企业状态
 */
export async function updateEnterpriseStatus(id: string, status: Enterprise['status']) {
  const response = await fetch(`/api/enterprises/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '更新企业状态失败')
  }

  return response.json()
}

/**
 * 获取引种记录列表
 */
export async function getImportRecords(
  enterpriseId: string,
  params: {
    page?: number
    pageSize?: number
    status?: string
    startDate?: string
    endDate?: string
  }
) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.append(key, String(value))
  })

  const response = await fetch(
    `/api/enterprises/${enterpriseId}/applications?${searchParams.toString()}`
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '获取引种记录失败')
  }

  return response.json()
}

/**
 * 获取引种记录详情
 */
export async function getImportRecord(id: string) {
  const response = await fetch(`/api/enterprises/applications/${id}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '获取引种记录详情失败')
  }

  return response.json()
} 