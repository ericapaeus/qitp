import { NextRequest } from 'next/server'
import { processDecisions, processReports, quarantineReleases } from '../data/reports'
import { parseQuery, parseBody, createResponse } from '../interceptor'
import type { ApiResponse, PaginationParams, DateRangeParams, SortOrder } from '../types'
import type {
  ProcessDecision,
  ProcessReport,
  QuarantineRelease,
  Attachment,
  CreateProcessDecisionRequest,
  CreateProcessReportRequest,
  CreateQuarantineReleaseRequest,
  UploadAttachmentRequest
} from '@/types/api/reports'

export const reportHandlers = [
  {
    method: 'GET',
    path: '/reports/decisions',
    async handler(request: NextRequest) {
      const { sampleId, status } = parseQuery(request)
      
      let result = [...processDecisions]
      
      if (sampleId) {
        result = result.filter(d => d.sampleId === sampleId)
      }
      
      if (status && status !== 'all') {
        result = result.filter(d => d.status === status)
      }
      
      return createResponse(result)
    }
  },

  {
    method: 'GET',
    path: '/reports/decisions/:id',
    async handler(request: NextRequest, params: Record<string, string>) {
      const decision = processDecisions.find(d => d.id === params.id)
      
      if (!decision) {
        return createResponse(null, 404)
      }
      
      return createResponse(decision)
    }
  },

  {
    method: 'POST',
    path: '/reports/decisions',
    async handler(request: NextRequest) {
      const body = await parseBody<CreateProcessDecisionRequest>(request)
      const decision: ProcessDecision = {
        id: Date.now().toString(),
        documentNo: `PD${new Date().getFullYear()}${String(processDecisions.length + 1).padStart(3, '0')}`,
        sampleId: body.sampleId,
        title: body.title,
        content: body.content,
        status: 'DRAFT',
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      processDecisions.push(decision)
      return createResponse(decision)
    }
  },

  {
    method: 'PUT',
    path: '/reports/decisions/:id',
    async handler(request: NextRequest, params: Record<string, string>) {
      const body = await parseBody<Partial<CreateProcessDecisionRequest>>(request)
      const index = processDecisions.findIndex(d => d.id === params.id)
      
      if (index === -1) {
        return createResponse(null, 404)
      }
      
      processDecisions[index] = {
        ...processDecisions[index],
        ...body,
        updatedAt: new Date().toISOString()
      }
      
      return createResponse(processDecisions[index])
    }
  },

  {
    method: 'PATCH',
    path: '/reports/decisions/:id/issue',
    async handler(request: NextRequest, params: Record<string, string>) {
      const body = await parseBody<{ issuedBy: string }>(request)
      const decision = processDecisions.find(d => d.id === params.id)
      
      if (!decision) {
        return createResponse(null, 404)
      }
      
      const user = {
        id: body.issuedBy,
        name: '张三' // 在实际应用中，这里应该从用户服务获取用户信息
      }
      
      decision.status = 'ISSUED'
      decision.issuedBy = user
      decision.issuedAt = new Date().toISOString()
      decision.updatedAt = new Date().toISOString()
      
      return createResponse(decision)
    }
  },

  {
    method: 'GET',
    path: '/reports/process-reports',
    async handler(request: NextRequest) {
      const { decisionId } = parseQuery(request)
      
      let result = [...processReports]
      
      if (decisionId) {
        result = result.filter(r => r.decisionId === decisionId)
      }
      
      return createResponse(result)
    }
  },

  {
    method: 'GET',
    path: '/reports/process-reports/:id',
    async handler(request: NextRequest, params: Record<string, string>) {
      const report = processReports.find(r => r.id === params.id)
      
      if (!report) {
        return createResponse(null, 404)
      }
      
      return createResponse(report)
    }
  },

  {
    method: 'POST',
    path: '/reports/process-reports',
    async handler(request: NextRequest) {
      const body = await parseBody<CreateProcessReportRequest>(request)
      const report: ProcessReport = {
        id: Date.now().toString(),
        documentNo: `PR${new Date().getFullYear()}${String(processReports.length + 1).padStart(3, '0')}`,
        decisionId: body.decisionId,
        title: body.title,
        content: body.content,
        processor: {
          id: 'PROCESSOR001',
          name: '处理员A'
        },
        processMethod: body.processMethod,
        processResult: body.processResult,
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
      
      return createResponse(report)
    }
  },

  {
    method: 'GET',
    path: '/reports/releases',
    async handler(request: NextRequest) {
      const { registrationNo } = parseQuery(request)
      
      let result = [...quarantineReleases]
      
      if (registrationNo) {
        result = result.filter(r => r.registrationNo === registrationNo)
      }
      
      return createResponse(result)
    }
  },

  {
    method: 'GET',
    path: '/reports/releases/:id',
    async handler(request: NextRequest, params: Record<string, string>) {
      const release = quarantineReleases.find(r => r.id === params.id)
      
      if (!release) {
        return createResponse(null, 404)
      }
      
      return createResponse(release)
    }
  },

  {
    method: 'POST',
    path: '/reports/releases',
    async handler(request: NextRequest) {
      const body = await parseBody<CreateQuarantineReleaseRequest>(request)
      const release: QuarantineRelease = {
        id: Date.now().toString(),
        documentNo: `QR${new Date().getFullYear()}${String(quarantineReleases.length + 1).padStart(3, '0')}`,
        registrationNo: body.registrationNo,
        title: body.title,
        content: body.content,
        issuer: {
          id: 'ISSUER001',
          name: '签发人A'
        },
        issuedAt: new Date().toISOString(),
        validUntil: body.validUntil,
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      quarantineReleases.push(release)
      return createResponse(release)
    }
  },

  {
    method: 'POST',
    path: '/reports/:type/:id/attachments',
    async handler(request: NextRequest, params: Record<string, string>) {
      const { type, id } = params
      const body = await parseBody<UploadAttachmentRequest>(request)
      
      let target: ProcessDecision | ProcessReport | QuarantineRelease | undefined
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
          return createResponse(null, 400)
      }
      
      if (!target) {
        return createResponse(null, 404)
      }
      
      const attachment: Attachment = {
        id: Date.now().toString(),
        name: body.name,
        url: body.url,
        size: body.size,
        type: body.type,
        uploadedAt: new Date().toISOString()
      }
      
      target.attachments.push(attachment)
      target.updatedAt = new Date().toISOString()
      
      return createResponse(attachment)
    }
  }
] 