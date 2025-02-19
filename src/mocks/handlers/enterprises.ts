import type { Enterprise, ImportApplication, ImportApplicationCreateInput } from '@/types/api/enterprises'
import { NextRequest } from 'next/server'
import { database, paginate, sort, filter } from '../db'
import type { ApiResponse, PaginationParams, DateRangeParams, SortOrder } from '../types'
import { parseQuery, parseBody, createResponse } from '../interceptor'

export const enterpriseHandlers = [
  {
    method: 'GET',
    path: '/enterprises',
    async handler(request: NextRequest) {
      const params = parseQuery(request)
      const { 
        keyword,
        province,
        city,
        page = 1,
        pageSize = 10,
        sortField,
        sortOrder
      } = params

      let enterprises = database.findMany<Enterprise>('enterprise')
      enterprises = filter(enterprises, {
        name: keyword,
        code: keyword,
        'address.province': province,
        'address.city': city
      })
      enterprises = sort(enterprises, sortField, sortOrder as SortOrder)
      const { items, total, current } = paginate(enterprises, Number(page), Number(pageSize))

      return createResponse({
        items,
        pagination: {
          current,
          pageSize: Number(pageSize),
          total
        }
      })
    }
  },

  {
    method: 'GET',
    path: '/enterprises/:id',
    async handler(request: NextRequest, params: Record<string, string>) {
      const enterprise = database.findFirst<Enterprise>('enterprise', { id: params.id })

      if (!enterprise) {
        return createResponse(null, 404)
      }

      return createResponse(enterprise)
    }
  },

  {
    method: 'POST',
    path: '/enterprises',
    async handler(request: NextRequest) {
      const body = await parseBody<Omit<Enterprise, 'id' | 'createdAt' | 'updatedAt'>>(request)
      const now = new Date().toISOString()

      const enterprise = database.create<Enterprise>('enterprise', {
        ...body,
        createdAt: now,
        updatedAt: now
      })

      return createResponse(enterprise)
    }
  },

  {
    method: 'PUT',
    path: '/enterprises/:id',
    async handler(request: NextRequest, params: Record<string, string>) {
      const body = await parseBody<Partial<Omit<Enterprise, 'id' | 'createdAt' | 'updatedAt'>>>(request)
      
      const enterprise = database.findFirst<Enterprise>('enterprise', { id: params.id })

      if (!enterprise) {
        return createResponse(null, 404)
      }

      const updated = database.update<Enterprise>('enterprise', { id: params.id }, {
        ...enterprise,
        ...body,
        updatedAt: new Date().toISOString()
      })

      return createResponse(updated)
    }
  },

  {
    method: 'GET',
    path: '/enterprises/:enterpriseId/applications',
    async handler(request: NextRequest, params: Record<string, string>) {
      const searchParams = parseQuery(request)
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
      } = searchParams

      let applications = database.findMany<ImportApplication>('importApplication', { 
        enterpriseId: params.enterpriseId 
      })

      applications = filter(applications, {
        status,
        'plant.name': plantName,
        'plant.sourceCountry': sourceCountry
      })

      if (startTime || endTime) {
        applications = applications.filter((app) => {
          const createdAt = new Date(app.createdAt).getTime()
          const start = startTime ? new Date(startTime).getTime() : 0
          const end = endTime ? new Date(endTime).getTime() : Infinity
          return createdAt >= start && createdAt <= end
        })
      }

      applications = sort(applications, sortField, sortOrder as SortOrder)
      const { items, total, current } = paginate(applications, Number(page), Number(pageSize))

      return createResponse({
        items,
        pagination: {
          current,
          pageSize: Number(pageSize),
          total
        }
      })
    }
  },

  {
    method: 'GET',
    path: '/enterprises/applications/:id',
    async handler(request: NextRequest, params: Record<string, string>) {
      const application = database.findFirst<ImportApplication>('importApplication', { 
        id: params.id 
      })

      if (!application) {
        return createResponse(null, 404)
      }

      return createResponse(application)
    }
  },

  {
    method: 'POST',
    path: '/enterprises/:enterpriseId/applications',
    async handler(request: NextRequest, params: Record<string, string>) {
      const body = await parseBody<ImportApplicationCreateInput>(request)
      const now = new Date().toISOString()

      const enterprise = await database.findFirst<Enterprise>('enterprise', { id: params.enterpriseId })
      if (!enterprise) {
        return createResponse(null, 404)
      }

      const application = database.create<ImportApplication>('importApplication', {
        enterpriseId: params.enterpriseId,
        enterpriseName: enterprise.name,
        approvalNo: `IA${new Date().getFullYear()}${String(database.count('importApplication') + 1).padStart(3, '0')}`,
        plant: body.plant,
        importInfo: body.importInfo,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now
      })

      return createResponse(application)
    }
  },

  {
    method: 'PATCH',
    path: '/enterprises/applications/:id/review',
    async handler(request: NextRequest, params: Record<string, string>) {
      const body = await parseBody<{
        approved: boolean
        comments: string
        quarantineRequired?: boolean
        quarantineSite?: string
        quarantinePeriod?: number
      }>(request)

      const application = database.findFirst<ImportApplication>('importApplication', { 
        id: params.id 
      })

      if (!application) {
        return createResponse(null, 404)
      }

      const updated = database.update<ImportApplication>(
        'importApplication', 
        { id: params.id },
        {
          ...application,
          status: body.approved ? 'APPROVED' : 'REJECTED',
          isolationInfo: body.quarantineRequired && body.quarantineSite ? {
            facilityId: body.quarantineSite,
            startDate: undefined,
            endDate: undefined
          } : undefined,
          updatedAt: new Date().toISOString()
        }
      )

      return createResponse(updated)
    }
  },

  {
    method: 'POST',
    path: '/enterprises/sync',
    async handler(request: NextRequest) {
      const now = new Date().toISOString()
      const syncCount = Math.floor(Math.random() * 5) + 1

      for (let i = 0; i < syncCount; i++) {
        const enterpriseId = Date.now().toString() + i
        database.create<Enterprise>('enterprise', {
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

      return createResponse({
        success: true,
        syncCount,
        syncTime: now,
      })
    }
  },

  {
    method: 'PATCH',
    path: '/enterprises/:id/status',
    async handler(request: NextRequest, params: Record<string, string>) {
      const body = await parseBody<{ status: 'ACTIVE' | 'SUSPENDED' }>(request)
      
      const enterprise = database.findFirst<Enterprise>('enterprise', { 
        id: params.id 
      })

      if (!enterprise) {
        return createResponse(null, 404)
      }

      const updated = database.update<Enterprise>(
        'enterprise',
        { id: params.id },
        {
          status: body.status,
          updatedAt: new Date().toISOString()
        }
      )

      return createResponse(updated)
    }
  }
] 