import { rest } from 'msw'
import { db, paginate, sort, filter } from '../db'
import type { EnterpriseAPI, ImportApplicationAPI } from '@/types/api/enterprises'
import type { ImportApplication } from '../data/enterprises'

export const enterpriseHandlers = [
  // 获取企业列表
  rest.get('/api/enterprises', (req, res, ctx) => {
    try {
      const { 
        keyword,
        province,
        city,
        page = 1,
        pageSize = 10,
        sortField,
        sortOrder
      } = Object.fromEntries(req.url.searchParams)

      // 获取所有企业
      let enterprises = db.enterprise.getAll()

      // 应用过滤
      enterprises = filter(enterprises, {
        name: keyword,
        code: keyword,
        'address.province': province,
        'address.city': city
      })

      // 应用排序
      enterprises = sort(enterprises, sortField, sortOrder as 'ascend' | 'descend')

      // 应用分页
      const { items, total, current } = paginate(enterprises, Number(page), Number(pageSize))

      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'success',
          data: items,
          pagination: {
            current,
            pageSize: Number(pageSize),
            total
          }
        })
      )
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({
          code: 500,
          message: error instanceof Error ? error.message : '未知错误'
        })
      )
    }
  }),

  // 获取单个企业
  rest.get('/api/enterprises/:id', (req, res, ctx) => {
    try {
      const { id } = req.params
      const enterprise = db.enterprise.findFirst({
        where: { id: { equals: String(id) } }
      })

      if (!enterprise) {
        return res(
          ctx.status(404),
          ctx.json({
            code: 404,
            message: 'Enterprise not found'
          })
        )
      }

      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'success',
          data: enterprise
        })
      )
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({
          code: 500,
          message: error instanceof Error ? error.message : '未知错误'
        })
      )
    }
  }),

  // 创建企业
  rest.post('/api/enterprises', async (req, res, ctx) => {
    try {
      const body = await req.json()
      const now = new Date().toISOString()

      const enterprise = db.enterprise.create({
        ...body,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      })

      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'success',
          data: enterprise
        })
      )
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({
          code: 500,
          message: error instanceof Error ? error.message : '未知错误'
        })
      )
    }
  }),

  // 更新企业
  rest.put('/api/enterprises/:id', async (req, res, ctx) => {
    try {
      const { id } = req.params
      const body = await req.json()

      const enterprise = db.enterprise.findFirst({
        where: { id: { equals: String(id) } }
      })

      if (!enterprise) {
        return res(
          ctx.status(404),
          ctx.json({
            code: 404,
            message: 'Enterprise not found'
          })
        )
      }

      const updated = db.enterprise.update({
        where: { id: { equals: String(id) } },
        data: {
          ...body,
          updatedAt: new Date().toISOString()
        }
      })

      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'success',
          data: updated
        })
      )
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({
          code: 500,
          message: error instanceof Error ? error.message : '未知错误'
        })
      )
    }
  }),

  // 获取引种申请列表
  rest.get('/api/enterprises/:enterpriseId/applications', (req, res, ctx) => {
    try {
      const { enterpriseId } = req.params
      const {
        status,
        plantName,
        sourceCountry,
        startTime,
        endTime,
        page = 1,
        pageSize = 10,
        sortField,
        sortOrder
      } = Object.fromEntries(req.url.searchParams)

      // 获取企业的所有申请
      let applications = db.importApplication.findMany({
        where: { enterpriseId: { equals: String(enterpriseId) } }
      })

      // 应用过滤
      applications = filter(applications, {
        status,
        plantName,
        sourceCountry
      })

      // 时间范围过滤
      if (startTime || endTime) {
        applications = applications.filter((app) => {
          const createdAt = new Date(app.createdAt).getTime()
          const start = startTime ? new Date(startTime).getTime() : 0
          const end = endTime ? new Date(endTime).getTime() : Infinity
          return createdAt >= start && createdAt <= end
        })
      }

      // 应用排序
      applications = sort(applications, sortField, sortOrder as 'ascend' | 'descend')

      // 应用分页
      const { items, total, current } = paginate(applications, Number(page), Number(pageSize))

      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'success',
          data: items,
          pagination: {
            current,
            pageSize: Number(pageSize),
            total
          }
        })
      )
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({
          code: 500,
          message: error instanceof Error ? error.message : '未知错误'
        })
      )
    }
  }),

  // 获取单个引种申请
  rest.get('/api/enterprises/applications/:id', (req, res, ctx) => {
    const { id } = req.params
    const application = db.importApplication.findFirst({
      where: { id: { equals: String(id) } }
    })
    
    if (!application) {
      return res(ctx.status(404))
    }
    
    return res(ctx.json(application))
  }),

  // 创建引种申请
  rest.post('/api/enterprises/:enterpriseId/applications', async (req, res, ctx) => {
    try {
      const { enterpriseId } = req.params
      const body = await req.json()
      const now = new Date().toISOString()

      const application = db.importApplication.create({
        ...body,
        id: String(Date.now()),
        enterpriseId: String(enterpriseId),
        applicationNo: `IA${new Date().getFullYear()}${String(db.importApplication.count() + 1).padStart(3, '0')}`,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now
      })

      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'success',
          data: application
        })
      )
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({
          code: 500,
          message: error instanceof Error ? error.message : '未知错误'
        })
      )
    }
  }),

  // 审核引种申请
  rest.patch('/api/enterprises/applications/:id/review', async (req, res, ctx) => {
    try {
      const { id } = req.params
      const body = await req.json()

      const application = db.importApplication.findFirst({
        where: { id: { equals: String(id) } }
      })

      if (!application) {
        return res(
          ctx.status(404),
          ctx.json({
            code: 404,
            message: 'Application not found'
          })
        )
      }

      const updated = db.importApplication.update({
        where: { id: { equals: String(id) } },
        data: {
          status: body.approved ? 'APPROVED' : 'REJECTED',
          reviewedAt: new Date().toISOString(),
          reviewer: body.reviewer,
          reviewComments: body.comments,
          reviewResult: body.approved ? 'APPROVED' : 'REJECTED',
          quarantineRequired: body.quarantineRequired,
          quarantineSite: body.quarantineSite,
          quarantinePeriod: body.quarantinePeriod,
          updatedAt: new Date().toISOString()
        }
      })

      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'success',
          data: updated
        })
      )
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({
          code: 500,
          message: error instanceof Error ? error.message : '未知错误'
        })
      )
    }
  }),

  // 同步企业数据
  rest.post('/api/enterprises/sync', async (req, res, ctx) => {
    try {
      const now = new Date().toISOString()
      const syncCount = Math.floor(Math.random() * 5) + 1 // 模拟同步 1-5 条数据

      // 模拟同步新数据
      for (let i = 0; i < syncCount; i++) {
        const enterpriseId = Date.now().toString() + i
        db.enterprise.create({
          id: enterpriseId,
          code: `E${enterpriseId.slice(-6)}`,
          name: `测试企业 ${enterpriseId.slice(-4)}`,
          contact: {
            address: '测试地址',
            person: '测试联系人',
            phone: '13800138000',
          },
          status: 'ACTIVE',
          syncTime: now,
          createdAt: now,
          updatedAt: now,
        })
      }

      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'success',
          data: {
            success: true,
            syncCount,
            syncTime: now,
          },
        })
      )
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({
          code: 500,
          message: error instanceof Error ? error.message : '同步失败',
          data: {
            success: false,
            syncCount: 0,
            syncTime: new Date().toISOString(),
            errorMessage: error instanceof Error ? error.message : '未知错误',
          },
        })
      )
    }
  }),

  // 更新企业状态
  rest.patch('/api/enterprises/:id/status', async (req, res, ctx) => {
    try {
      const { id } = req.params
      const { status } = await req.json()

      const enterprise = db.enterprise.findFirst({
        where: { id: { equals: String(id) } },
      })

      if (!enterprise) {
        return res(
          ctx.status(404),
          ctx.json({
            code: 404,
            message: '企业不存在',
          })
        )
      }

      const updated = db.enterprise.update({
        where: { id: { equals: String(id) } },
        data: {
          status,
          updatedAt: new Date().toISOString(),
        },
      })

      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'success',
          data: updated,
        })
      )
    } catch (error) {
      return res(
        ctx.status(500),
        ctx.json({
          code: 500,
          message: error instanceof Error ? error.message : '更新失败',
        })
      )
    }
  })
] 