import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/mocks/db'
import { APIResponse } from '@/types/api'
import type { Enterprise, ImportRecord } from '@/types/api/enterprises'

// GET /api/enterprises/stats
export async function GET(req: NextRequest) {
  try {
    const enterprises = database.findMany<Enterprise>('enterprise')
    const records = database.findMany<ImportRecord>('importRecord')

    const total = enterprises.length
    const active = enterprises.filter(e => e.status === 'ACTIVE').length
    const suspended = enterprises.filter(e => e.status === 'SUSPENDED').length

    const importing = records.filter(r => r.status === 'IMPORTING').length
    const isolating = records.filter(r => r.status === 'ISOLATING').length

    const response: APIResponse<{
      total: number
      active: number
      suspended: number
      importing: number
      isolating: number
    }> = {
      code: 200,
      message: 'success',
      data: {
        total,
        active,
        suspended,
        importing,
        isolating
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
} 