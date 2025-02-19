import { ID, ISODate, EnvironmentData, Alert, TimelineEvent, Statistics } from './types'

// 导出基础类型
export type { EnvironmentData, Alert, TimelineEvent, Statistics }

// 导出示例数据
export const environmentData: EnvironmentData[] = [
  {
    id: '1',
    timestamp: '2024-02-19T00:00:00Z',
    temperature: 25.5,
    humidity: 65,
    light: 1000,
    location: 'A区'
  }
]

export const alerts: Alert[] = [
  {
    id: '1',
    title: '温度超标警告',
    description: 'A区温室温度超过预警值，请及时处理',
    level: 'WARNING',
    timestamp: '2024-02-19T00:00:00Z',
    isRead: false,
    source: 'ENVIRONMENT'
  }
]

export const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'ENVIRONMENT',
    title: '温度异常',
    description: 'A区温室温度超过28°C',
    timestamp: '2024-02-19T00:00:00Z',
    status: 'WARNING'
  }
]

export const statistics: Statistics = {
  activeSamples: {
    value: 23,
    trend: '+2',
    trendType: 'UP'
  },
  abnormalCount: {
    value: 3,
    trend: '+1',
    trendType: 'UP',
    status: 'WARNING'
  },
  pendingTasks: {
    value: 5,
    trend: '-2',
    trendType: 'DOWN'
  },
  completionRate: {
    value: '92%',
    trend: '+5%',
    trendType: 'UP',
    status: 'SUCCESS'
  }
} 