import { rest } from 'msw'
import { processDecisions, processReports, quarantineReleases } from '../data/reports'

export const reportHandlers = [
  // 获取处理决定通知书列表
  rest.get('/api/reports/decisions', (req, res, ctx) => {
    const sampleId = req.url.searchParams.get('sampleId')
    const status = req.url.searchParams.get('status')
    
    let result = [...processDecisions]
    
    if (sampleId) {
      result = result.filter(d => d.sampleId === sampleId)
    }
    
    if (status && status !== 'all') {
      result = result.filter(d => d.status === status)
    }
    
    return res(ctx.json(result))
  }),

  // 获取单个处理决定通知书
  rest.get('/api/reports/decisions/:id', (req, res, ctx) => {
    const { id } = req.params
    const decision = processDecisions.find(d => d.id === id)
    
    if (!decision) {
      return res(ctx.status(404))
    }
    
    return res(ctx.json(decision))
  }),

  // 创建处理决定通知书
  rest.post('/api/reports/decisions', async (req, res, ctx) => {
    const body = await req.json()
    const decision = {
      id: Date.now().toString(),
      documentNo: `PD${new Date().getFullYear()}${String(processDecisions.length + 1).padStart(3, '0')}`,
      ...body,
      status: 'DRAFT',
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    processDecisions.push(decision)
    return res(ctx.json(decision))
  }),

  // 更新处理决定通知书
  rest.put('/api/reports/decisions/:id', async (req, res, ctx) => {
    const { id } = req.params
    const body = await req.json()
    const index = processDecisions.findIndex(d => d.id === id)
    
    if (index === -1) {
      return res(ctx.status(404))
    }
    
    processDecisions[index] = {
      ...processDecisions[index],
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    return res(ctx.json(processDecisions[index]))
  }),

  // 签发处理决定通知书
  rest.patch('/api/reports/decisions/:id/issue', async (req, res, ctx) => {
    const { id } = req.params
    const body = await req.json()
    const decision = processDecisions.find(d => d.id === id)
    
    if (!decision) {
      return res(ctx.status(404))
    }
    
    decision.status = 'ISSUED'
    decision.issuedBy = body.issuedBy
    decision.issuedAt = new Date().toISOString()
    decision.updatedAt = new Date().toISOString()
    
    return res(ctx.json(decision))
  }),

  // 获取处理报告列表
  rest.get('/api/reports/process-reports', (req, res, ctx) => {
    const decisionId = req.url.searchParams.get('decisionId')
    
    let result = [...processReports]
    
    if (decisionId) {
      result = result.filter(r => r.decisionId === decisionId)
    }
    
    return res(ctx.json(result))
  }),

  // 获取单个处理报告
  rest.get('/api/reports/process-reports/:id', (req, res, ctx) => {
    const { id } = req.params
    const report = processReports.find(r => r.id === id)
    
    if (!report) {
      return res(ctx.status(404))
    }
    
    return res(ctx.json(report))
  }),

  // 创建处理报告
  rest.post('/api/reports/process-reports', async (req, res, ctx) => {
    const body = await req.json()
    const report = {
      id: Date.now().toString(),
      documentNo: `PR${new Date().getFullYear()}${String(processReports.length + 1).padStart(3, '0')}`,
      ...body,
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    processReports.push(report)
    
    // 更新处理决定通知书状态
    const decision = processDecisions.find(d => d.id === body.decisionId)
    if (decision) {
      decision.status = 'PROCESSED'
      decision.updatedAt = new Date().toISOString()
    }
    
    return res(ctx.json(report))
  }),

  // 获取检疫放行证书列表
  rest.get('/api/reports/releases', (req, res, ctx) => {
    const registrationNo = req.url.searchParams.get('registrationNo')
    
    let result = [...quarantineReleases]
    
    if (registrationNo) {
      result = result.filter(r => r.registrationNo === registrationNo)
    }
    
    return res(ctx.json(result))
  }),

  // 获取单个检疫放行证书
  rest.get('/api/reports/releases/:id', (req, res, ctx) => {
    const { id } = req.params
    const release = quarantineReleases.find(r => r.id === id)
    
    if (!release) {
      return res(ctx.status(404))
    }
    
    return res(ctx.json(release))
  }),

  // 创建检疫放行证书
  rest.post('/api/reports/releases', async (req, res, ctx) => {
    const body = await req.json()
    const release = {
      id: Date.now().toString(),
      documentNo: `QR${new Date().getFullYear()}${String(quarantineReleases.length + 1).padStart(3, '0')}`,
      ...body,
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    quarantineReleases.push(release)
    return res(ctx.json(release))
  }),

  // 上传报告附件
  rest.post('/api/reports/:type/:id/attachments', async (req, res, ctx) => {
    const { type, id } = req.params
    const body = await req.json()
    
    let target
    switch (type) {
      case 'decisions':
        target = processDecisions.find(d => d.id === id)
        break
      case 'process-reports':
        target = processReports.find(r => r.id === id)
        break
      case 'releases':
        target = quarantineReleases.find(r => r.id === id)
        break
      default:
        return res(ctx.status(400))
    }
    
    if (!target) {
      return res(ctx.status(404))
    }
    
    const attachment = {
      id: Date.now().toString(),
      ...body,
      uploadedAt: new Date().toISOString()
    }
    
    target.attachments.push(attachment)
    target.updatedAt = new Date().toISOString()
    
    return res(ctx.json(attachment))
  })
] 