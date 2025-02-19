import { rest } from 'msw'
import { addMinutes, subMinutes, format } from 'date-fns'

// 生成过去24小时的环境数据
function generateEnvironmentData() {
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
function generateLatestEnvironmentData() {
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
const timelineItems = [
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
  },
  // ... 其他时间线数据
]

// 生成告警数据
const alerts = [
  {
    id: '1',
    title: '温度超标警告',
    description: 'A区温室温度超过预警值，请及时处理',
    time: '10分钟前',
    timestamp: subMinutes(new Date(), 10).toISOString(),
    level: 'warning',
    isRead: false
  },
  // ... 其他告警数据
]

// 统计数据
const statistics = {
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
const samples = [
  {
    id: '1',
    registrationNo: 'S2024020001',
    plantName: '水稻种子',
    quantity: '500g',
    sourceCountry: '日本',
    status: 'REGISTERED',
    createdAt: '2024-02-17T10:00:00'
  },
  {
    id: '2',
    registrationNo: 'S2024020002',
    plantName: '玉米种子',
    quantity: '1kg',
    sourceCountry: '美国',
    status: 'IN_QUARANTINE',
    createdAt: '2024-02-17T11:30:00'
  }
]

export const isolationHandlers = [
  // 获取环境数据历史
  rest.get('/api/isolation/environment/history', (req, res, ctx) => {
    return res(ctx.json(generateEnvironmentData()))
  }),

  // 获取最新环境数据
  rest.get('/api/isolation/environment/latest', (req, res, ctx) => {
    return res(ctx.json(generateLatestEnvironmentData()))
  }),

  // 获取时间线数据
  rest.get('/api/isolation/timeline', (req, res, ctx) => {
    const filter = req.url.searchParams.get('filter') || 'all'
    
    let filteredItems = [...timelineItems]
    if (filter === 'warning') {
      filteredItems = filteredItems.filter(item => item.status === 'warning')
    } else if (filter === 'today') {
      const today = new Date().toDateString()
      filteredItems = filteredItems.filter(item => 
        new Date(item.timestamp).toDateString() === today
      )
    }
    
    return res(ctx.json(filteredItems))
  }),

  // 获取告警数据
  rest.get('/api/isolation/alerts', (req, res, ctx) => {
    return res(ctx.json(alerts))
  }),

  // 标记告警为已读
  rest.patch('/api/isolation/alerts/:id/read', (req, res, ctx) => {
    const { id } = req.params
    const alert = alerts.find(a => a.id === id)
    if (alert) {
      alert.isRead = true
    }
    return res(ctx.json({ success: true }))
  }),

  // 标记所有告警为已读
  rest.patch('/api/isolation/alerts/read-all', (req, res, ctx) => {
    alerts.forEach(alert => {
      alert.isRead = true
    })
    return res(ctx.json({ success: true }))
  }),

  // 获取统计数据
  rest.get('/api/isolation/statistics', (req, res, ctx) => {
    return res(ctx.json(statistics))
  }),

  // 获取样品列表
  rest.get('/api/isolation/samples', (req, res, ctx) => {
    return res(ctx.json(samples))
  }),

  // 创建新样品
  rest.post('/api/isolation/samples', async (req, res, ctx) => {
    const body = await req.json()
    const sample = {
      id: Date.now().toString(),
      registrationNo: `S${format(new Date(), 'yyyyMMdd')}${String(samples.length + 1).padStart(3, '0')}`,
      ...body,
      status: 'REGISTERED',
      createdAt: new Date().toISOString()
    }
    samples.push(sample)
    return res(ctx.json(sample))
  }),

  // 获取单个样品
  rest.get('/api/isolation/samples/:id', (req, res, ctx) => {
    const { id } = req.params
    const sample = samples.find(s => s.id === id)
    if (!sample) {
      return res(ctx.status(404))
    }
    return res(ctx.json(sample))
  })
] 