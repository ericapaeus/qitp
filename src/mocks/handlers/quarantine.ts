import { rest } from 'msw'
import { quarantineSites, quarantineSamples } from '../data/quarantine'

export const quarantineHandlers = [
  // 获取检疫场所列表
  rest.get('/api/quarantine/sites', (req, res, ctx) => {
    const type = req.url.searchParams.get('type')
    const status = req.url.searchParams.get('status')
    
    let result = [...quarantineSites]
    
    if (type && type !== 'all') {
      result = result.filter(s => s.type === type)
    }
    
    if (status && status !== 'all') {
      result = result.filter(s => s.status === status)
    }
    
    return res(ctx.json(result))
  }),

  // 获取单个检疫场所
  rest.get('/api/quarantine/sites/:id', (req, res, ctx) => {
    const { id } = req.params
    const site = quarantineSites.find(s => s.id === id)
    
    if (!site) {
      return res(ctx.status(404))
    }
    
    return res(ctx.json(site))
  }),

  // 创建检疫场所
  rest.post('/api/quarantine/sites', async (req, res, ctx) => {
    const body = await req.json()
    const site = {
      id: Date.now().toString(),
      ...body,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    quarantineSites.push(site)
    return res(ctx.json(site))
  }),

  // 更新检疫场所
  rest.put('/api/quarantine/sites/:id', async (req, res, ctx) => {
    const { id } = req.params
    const body = await req.json()
    const index = quarantineSites.findIndex(s => s.id === id)
    
    if (index === -1) {
      return res(ctx.status(404))
    }
    
    quarantineSites[index] = {
      ...quarantineSites[index],
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    return res(ctx.json(quarantineSites[index]))
  }),

  // 获取检疫样品列表
  rest.get('/api/quarantine/samples', (req, res, ctx) => {
    const siteId = req.url.searchParams.get('siteId')
    const status = req.url.searchParams.get('status')
    
    let result = [...quarantineSamples]
    
    if (siteId) {
      result = result.filter(s => s.siteId === siteId)
    }
    
    if (status && status !== 'all') {
      result = result.filter(s => s.status === status)
    }
    
    return res(ctx.json(result))
  }),

  // 获取单个检疫样品
  rest.get('/api/quarantine/samples/:id', (req, res, ctx) => {
    const { id } = req.params
    const sample = quarantineSamples.find(s => s.id === id)
    
    if (!sample) {
      return res(ctx.status(404))
    }
    
    return res(ctx.json(sample))
  }),

  // 创建检疫样品
  rest.post('/api/quarantine/samples', async (req, res, ctx) => {
    const body = await req.json()
    const sample = {
      id: Date.now().toString(),
      registrationNo: `${body.siteId.substring(0, 2)}${new Date().getFullYear()}${String(quarantineSamples.length + 1).padStart(3, '0')}`,
      ...body,
      status: 'REGISTERED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    quarantineSamples.push(sample)
    return res(ctx.json(sample))
  }),

  // 更新检疫样品
  rest.put('/api/quarantine/samples/:id', async (req, res, ctx) => {
    const { id } = req.params
    const body = await req.json()
    const index = quarantineSamples.findIndex(s => s.id === id)
    
    if (index === -1) {
      return res(ctx.status(404))
    }
    
    quarantineSamples[index] = {
      ...quarantineSamples[index],
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    return res(ctx.json(quarantineSamples[index]))
  }),

  // 更新检疫样品状态
  rest.patch('/api/quarantine/samples/:id/status', async (req, res, ctx) => {
    const { id } = req.params
    const body = await req.json()
    const sample = quarantineSamples.find(s => s.id === id)
    
    if (!sample) {
      return res(ctx.status(404))
    }
    
    sample.status = body.status
    sample.updatedAt = new Date().toISOString()
    
    return res(ctx.json(sample))
  }),

  // 上传检疫样品附件
  rest.post('/api/quarantine/samples/:id/attachments', async (req, res, ctx) => {
    const { id } = req.params
    const body = await req.json()
    const sample = quarantineSamples.find(s => s.id === id)
    
    if (!sample) {
      return res(ctx.status(404))
    }
    
    const attachment = {
      id: Date.now().toString(),
      ...body,
      uploadedAt: new Date().toISOString()
    }
    
    sample.attachments.push(attachment)
    sample.updatedAt = new Date().toISOString()
    
    return res(ctx.json(attachment))
  })
] 