import { NextRequest } from 'next/server'
import { database, paginate, sort, filter } from '../db'
import { parseQuery, parseBody, createResponse } from '../interceptor'
import type { ApiResponse, PaginationParams, DateRangeParams, SortOrder } from '../types'
import type { QuarantineTask, QuarantineSite, QuarantineSample } from '@/types/api/quarantine'

export const quarantineHandlers = [
  {
    method: 'GET',
    path: '/quarantine/sites',
    async handler(request: NextRequest) {
      const { type, status } = parseQuery(request)
      
      let result = database.findMany<QuarantineSite>('quarantineSite')
      
      if (type && type !== 'all') {
        result = result.filter((s: QuarantineSite) => s.type === type)
      }
      
      if (status && status !== 'all') {
        result = result.filter((s: QuarantineSite) => s.status === status)
      }
      
      return createResponse(result)
    }
  },

  {
    method: 'GET',
    path: '/quarantine/sites/:id',
    async handler(request: NextRequest, params: Record<string, string>) {
      const site = database.findFirst<QuarantineSite>('quarantineSite', {
        id: params.id
      })
      
      if (!site) {
        return createResponse(null, 404)
      }
      
      return createResponse(site)
    }
  },

  {
    method: 'POST',
    path: '/quarantine/sites',
    async handler(request: NextRequest) {
      const body = await parseBody<Omit<QuarantineSite, 'id' | 'createdAt' | 'updatedAt'>>(request)
      const now = new Date().toISOString()
      
      const site = database.create<QuarantineSite>('quarantineSite', {
        ...body,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now
      })
      
      return createResponse(site)
    }
  },

  {
    method: 'PUT',
    path: '/quarantine/sites/:id',
    async handler(request: NextRequest, params: Record<string, string>) {
      const body = await parseBody<Partial<Omit<QuarantineSite, 'id' | 'createdAt' | 'updatedAt'>>>(request)
      
      const site = database.findFirst<QuarantineSite>('quarantineSite', {
        id: params.id
      })
      
      if (!site) {
        return createResponse(null, 404)
      }
      
      const updated = database.update<QuarantineSite>('quarantineSite', 
        { id: params.id },
        {
          ...site,
          ...body,
          updatedAt: new Date().toISOString()
        }
      )
      
      return createResponse(updated)
    }
  },

  {
    method: 'GET',
    path: '/quarantine/samples',
    async handler(request: NextRequest) {
      const { siteId, status } = parseQuery(request)
      
      let result = database.findMany<QuarantineSample>('quarantineSample')
      
      if (siteId) {
        result = result.filter((s: QuarantineSample) => s.siteId === siteId)
      }
      
      if (status && status !== 'all') {
        result = result.filter((s: QuarantineSample) => s.status === status)
      }
      
      return createResponse(result)
    }
  },

  {
    method: 'GET',
    path: '/quarantine/samples/:id',
    async handler(request: NextRequest, params: Record<string, string>) {
      const sample = database.findFirst<QuarantineSample>('quarantineSample', {
        id: params.id
      })
      
      if (!sample) {
        return createResponse(null, 404)
      }
      
      return createResponse(sample)
    }
  },

  {
    method: 'POST',
    path: '/quarantine/samples',
    async handler(request: NextRequest) {
      const body = await parseBody<Omit<QuarantineSample, 'id' | 'attachments' | 'createdAt' | 'updatedAt'>>(request)
      const now = new Date().toISOString()
      
      const sample = database.create<QuarantineSample>('quarantineSample', {
        ...body,
        attachments: [],
        status: 'REGISTERED',
        createdAt: now,
        updatedAt: now
      })
      
      return createResponse(sample)
    }
  },

  {
    method: 'PUT',
    path: '/quarantine/samples/:id',
    async handler(request: NextRequest, params: Record<string, string>) {
      const body = await parseBody<Partial<Omit<QuarantineSample, 'id' | 'attachments' | 'createdAt' | 'updatedAt'>>>(request)
      
      const sample = database.findFirst<QuarantineSample>('quarantineSample', {
        id: params.id
      })
      
      if (!sample) {
        return createResponse(null, 404)
      }
      
      const updated = database.update<QuarantineSample>('quarantineSample',
        { id: params.id },
        {
          ...sample,
          ...body,
          updatedAt: new Date().toISOString()
        }
      )
      
      return createResponse(updated)
    }
  },

  {
    method: 'PATCH',
    path: '/quarantine/samples/:id/status',
    async handler(request: NextRequest, params: Record<string, string>) {
      const body = await parseBody<{ status: QuarantineSample['status'] }>(request)
      
      const sample = database.findFirst<QuarantineSample>('quarantineSample', {
        id: params.id
      })
      
      if (!sample) {
        return createResponse(null, 404)
      }
      
      const updated = database.update<QuarantineSample>('quarantineSample',
        { id: params.id },
        {
          ...sample,
          status: body.status,
          updatedAt: new Date().toISOString()
        }
      )
      
      return createResponse(updated)
    }
  },

  {
    method: 'POST',
    path: '/quarantine/samples/:id/attachments',
    async handler(request: NextRequest, params: Record<string, string>) {
      const body = await parseBody<{
        name: string
        url: string
        type: string
        size: number
      }>(request)
      
      const sample = database.findFirst<QuarantineSample>('quarantineSample', {
        id: params.id
      })
      
      if (!sample) {
        return createResponse(null, 404)
      }
      
      const attachment = {
        id: Date.now().toString(),
        ...body,
        uploadedAt: new Date().toISOString()
      }
      
      const updated = database.update<QuarantineSample>('quarantineSample',
        { id: params.id },
        {
          ...sample,
          attachments: [...(sample.attachments || []), attachment],
          updatedAt: new Date().toISOString()
        }
      )
      
      return createResponse(attachment)
    }
  }
] 