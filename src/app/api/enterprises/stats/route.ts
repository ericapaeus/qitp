import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/mocks/db'
import { APIResponse } from '@/types/api'

interface Enterprise {
  id: string
  name: string
  code: string
  status: 'ACTIVE' | 'SUSPENDED'
  address: {
    province: string
    city: string
    district: string
    detail: string
  }
  contact: {
    name: string
    phone: string
    email: string
  }
  business: {
    type: string
    license: string
    expireDate: string
  }
  createdAt: string
  updatedAt: string
}

interface ImportApplication {
  id: string
  enterpriseId: string
  status: 'PENDING' | 'IMPORTING' | 'ISOLATING' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

// GET /api/enterprises/stats
export async function GET(req: NextRequest) {
  try {
    const enterprises = db.enterprise.getAll() as unknown as Enterprise[]
    const applications = db.importApplication.getAll() as unknown as ImportApplication[]

    const total = enterprises.length
    const active = enterprises.filter(e => e.status === 'ACTIVE').length
    const suspended = enterprises.filter(e => e.status === 'SUSPENDED').length

    const importing = applications.filter(a => a.status === 'IMPORTING').length
    const isolating = applications.filter(a => a.status === 'ISOLATING').length

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