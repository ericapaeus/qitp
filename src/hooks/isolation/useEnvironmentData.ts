import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

interface EnvironmentData {
  id: string
  time: string
  timestamp: string
  temperature: number
  humidity: number
  light: number
}

async function fetchEnvironmentHistory(): Promise<EnvironmentData[]> {
  const response = await fetch('/api/isolation/environment/history')
  if (!response.ok) {
    throw new Error('Failed to fetch environment history')
  }
  return response.json()
}

async function fetchLatestEnvironment(): Promise<EnvironmentData> {
  const response = await fetch('/api/isolation/environment/latest')
  if (!response.ok) {
    throw new Error('Failed to fetch latest environment data')
  }
  return response.json()
}

export function useEnvironmentData() {
  const queryClient = useQueryClient()

  // 获取历史数据
  const { 
    data: historyData,
    isLoading: isHistoryLoading,
    error: historyError
  } = useQuery({
    queryKey: ['environment', 'history'],
    queryFn: fetchEnvironmentHistory,
    refetchInterval: false,
    staleTime: 5 * 60 * 1000 // 5分钟
  })

  // 获取最新数据
  const {
    data: latestData,
    isLoading: isLatestLoading,
    error: latestError
  } = useQuery({
    queryKey: ['environment', 'latest'],
    queryFn: fetchLatestEnvironment,
    refetchInterval: 5000, // 5秒更新一次
    select: (data) => {
      // 如果有历史数据，更新历史数据
      if (historyData) {
        queryClient.setQueryData(
          ['environment', 'history'],
          (old: EnvironmentData[] | undefined) => {
            if (!old) return old
            return [...old.slice(1), data]
          }
        )
      }
      return data
    }
  })

  const isLoading = isHistoryLoading || isLatestLoading
  const error = historyError || latestError

  return {
    data: historyData || [],
    latestData,
    isLoading,
    error
  }
} 