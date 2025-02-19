import { NextRequest } from 'next/server'
import { database, paginate, sort, filter } from '../db'
import { parseQuery, parseBody, createResponse } from '../interceptor'
import type { ApiResponse, PaginationParams, DateRangeParams, SortOrder } from '../types'
import type { LaboratoryTask } from '@/types/api/laboratory'

export const laboratoryHandlers = [
  {
    method: 'GET',
    path: '/laboratory/tasks',
    async handler(request: NextRequest) {
      const params = parseQuery(request)
      const {
        keyword,
        status,
        type,
        startTime,
        endTime,
        page = 1,
        pageSize = 10,
        sortField,
        sortOrder
      } = params

      let tasks = database.findMany<LaboratoryTask>('laboratoryTask')

      tasks = filter(tasks, {
        status,
        type,
        'subject.name': keyword,
        'assignee.name': keyword
      })

      if (startTime || endTime) {
        tasks = tasks.filter((task) => {
          const createdAt = new Date(task.createdAt).getTime()
          const start = startTime ? new Date(startTime).getTime() : 0
          const end = endTime ? new Date(endTime).getTime() : Infinity
          return createdAt >= start && createdAt <= end
        })
      }

      tasks = sort(tasks, sortField, sortOrder as SortOrder)
      const { items, total, current } = paginate(tasks, Number(page), Number(pageSize))

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
    path: '/laboratory/tasks/:id',
    async handler(request: NextRequest, params: Record<string, string>) {
      const task = database.findFirst<LaboratoryTask>('laboratoryTask', { id: params.id })

      if (!task) {
        return createResponse(null, 404)
      }

      return createResponse(task)
    }
  }
] 