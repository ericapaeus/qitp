import { NextRequest } from 'next/server'
import { addMinutes, subMinutes, format } from 'date-fns'
import { parseQuery, parseBody, createResponse } from '../interceptor'
import type { IsolationSample, EnvironmentData, TimelineItem, Alert, IsolationStatistics, CreateSampleRequest } from '@/types/api/isolation'

// 生成过去24小时的环境数据
function generateEnvironmentData(): EnvironmentData[] {
  const now = new Date()
  return Array.from({ length: 24 }, (_, i) => {
    const time = subMinutes(now, (23 - i) * 60)
    return {
      id: i.toString(),
      time: format(time, 'HH:mm'),
      timestamp: time.toISOString(),
      temperature: 20 + Math.random() * 5,
      humidity: 60 + Math.random() * 20,
      light: 800 + Math.random() * 400,
    }
  })
}

// 生成最新的环境数据
function generateLatestEnvironmentData(): EnvironmentData {
  const now = new Date()
  return {
    id: now.getTime().toString(),
    time: format(now, 'HH:mm'),
    timestamp: now.toISOString(),
    temperature: 20 + Math.random() * 5,
    humidity: 60 + Math.random() * 20,
    light: 800 + Math.random() * 400,
  }
}

// 生成进度时间线数据
const timelineItems: TimelineItem[] = [
  {
    id: '1',
    time: format(subMinutes(new Date(), 30), 'HH:mm'),
    timestamp: subMinutes(new Date(), 30).toISOString(),
    title: '样品接收完成',
    description: '样品 S2024020001 已完成接收登记',
    status: 'success',
    type: 'sample'
  },
  {
    id: '2',
    time: format(subMinutes(new Date(), 20), 'HH:mm'),
    timestamp: subMinutes(new Date(), 20).toISOString(),
    title: '温度异常警告',
    description: '温室 A 区温度超过 28°C',
    status: 'warning',
    type: 'environment'
  }
]

// 生成告警数据
const alerts: Alert[] = [
  {
    id: '1',
    title: '温度超标警告',
    description: 'A区温室温度超过预警值，请及时处理',
    time: '10分钟前',
    timestamp: subMinutes(new Date(), 10).toISOString(),
    level: 'warning',
    isRead: false
  }
]

// 统计数据
const statistics: IsolationStatistics = {
  activeSamples: {
    value: 23,
    trend: '+2',
    trendType: 'up'
  },
  abnormalCount: {
    value: 3,
    trend: '+1',
    trendType: 'up',
    status: 'warning'
  },
  pendingTasks: {
    value: 5,
    trend: '-2',
    trendType: 'down'
  },
  completionRate: {
    value: '92%',
    trend: '+5%',
    trendType: 'up',
    status: 'success'
  }
}

// 样品数据
const samples: IsolationSample[] = [
  {
    id: '1',
    siteId: 'SITE001',
    registrationNo: 'S2024020001',
    plantName: '水稻种子',
    quantity: '500g',
    sourceCountry: '日本',
    status: 'REGISTERED',
    createdAt: '2024-02-17T10:00:00Z',
    updatedAt: '2024-02-17T10:00:00Z'
  },
  {
    id: '2',
    siteId: 'SITE001',
    registrationNo: 'S2024020002',
    plantName: '玉米种子',
    quantity: '1kg',
    sourceCountry: '美国',
    status: 'IN_QUARANTINE',
    createdAt: '2024-02-17T11:30:00Z',
    updatedAt: '2024-02-17T11:30:00Z'
  }
]

export const isolationHandlers = [
  {
    method: 'GET',
    path: '/isolation/environment/history',
    async handler(request: NextRequest) {
      return createResponse(generateEnvironmentData())
    }
  },

  {
    method: 'GET',
    path: '/isolation/environment/latest',
    async handler(request: NextRequest) {
      return createResponse(generateLatestEnvironmentData())
    }
  },

  {
    method: 'GET',
    path: '/isolation/timeline',
    async handler(request: NextRequest) {
      const { filter } = parseQuery(request)
      
      let filteredItems = [...timelineItems]
      if (filter === 'warning') {
        filteredItems = filteredItems.filter(item => item.status === 'warning')
      } else if (filter === 'today') {
        const today = new Date().toDateString()
        filteredItems = filteredItems.filter(item => 
          new Date(item.timestamp).toDateString() === today
        )
      }
      
      return createResponse(filteredItems)
    }
  },

  {
    method: 'GET',
    path: '/isolation/alerts',
    async handler(request: NextRequest) {
      return createResponse(alerts)
    }
  },

  {
    method: 'PATCH',
    path: '/isolation/alerts/:id/read',
    async handler(request: NextRequest, params: Record<string, string>) {
      const alert = alerts.find(a => a.id === params.id)
      if (alert) {
        alert.isRead = true
      }
      return createResponse({ success: true })
    }
  },

  {
    method: 'PATCH',
    path: '/isolation/alerts/read-all',
    async handler(request: NextRequest) {
      alerts.forEach(alert => {
        alert.isRead = true
      })
      return createResponse({ success: true })
    }
  },

  {
    method: 'GET',
    path: '/isolation/statistics',
    async handler(request: NextRequest) {
      return createResponse(statistics)
    }
  },

  {
    method: 'GET',
    path: '/isolation/samples',
    async handler(request: NextRequest) {
      const { siteId, status } = parseQuery(request)
      
      let result = [...samples]
      
      if (siteId) {
        result = result.filter(s => s.siteId === siteId)
      }
      
      if (status && status !== 'all') {
        result = result.filter(s => s.status === status)
      }
      
      return createResponse(result)
    }
  },

  {
    method: 'GET',
    path: '/isolation/samples/:id',
    async handler(request: NextRequest, params: Record<string, string>) {
      const sample = samples.find(s => s.id === params.id)
      
      if (!sample) {
        return createResponse(null, 404)
      }
      
      return createResponse(sample)
    }
  },

  {
    method: 'POST',
    path: '/isolation/samples',
    async handler(request: NextRequest) {
      const body = await parseBody<CreateSampleRequest>(request)
      const now = new Date().toISOString()
      
      const sample: IsolationSample = {
        id: Date.now().toString(),
        siteId: body.siteId,
        registrationNo: `${body.siteId.substring(0, 2)}${new Date().getFullYear()}${String(samples.length + 1).padStart(3, '0')}`,
        plantName: body.plantName,
        quantity: body.quantity,
        sourceCountry: body.sourceCountry,
        status: 'REGISTERED',
        createdAt: now,
        updatedAt: now
      }
      
      samples.push(sample)
      return createResponse(sample)
    }
  }
] 