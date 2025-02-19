import { NextRequest } from 'next/server'
import { database, paginate, sort, filter } from '../db'
import type { ApiResponse, PaginationParams, DateRangeParams, SortOrder } from '../types'
import type { ImportApplication } from '@/types/api/enterprises'
import { parseQuery, parseBody, createResponse } from '../interceptor'

export const applicationHandlers = [
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
      const body = await parseBody<Omit<ImportApplication, 'id' | 'createdAt' | 'updatedAt'>>(request)
      const now = new Date().toISOString()

      const application = database.create<ImportApplication>('importApplication', {
        ...body,
        enterpriseId: params.enterpriseId,
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

      const updated = database.update<ImportApplication>('importApplication', 
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
  }
] 