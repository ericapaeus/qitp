import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/mocks/db'
import { APIResponse } from '@/types/api'
import type { Enterprise } from '@/types/api/enterprises'

// GET /api/enterprises
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = Number(searchParams.get('page')) || 1
    const pageSize = Number(searchParams.get('pageSize')) || 10
    const keyword = searchParams.get('keyword')
    const province = searchParams.get('province')
    const city = searchParams.get('city')
    const sortField = searchParams.get('sortField')
    const sortOrder = searchParams.get('sortOrder') as 'ascend' | 'descend' | null

    // 获取所有企业
    let enterprises = database.findMany<Enterprise>('enterprise')

    // 应用过滤
    if (keyword || province || city) {
      enterprises = enterprises.filter((enterprise: Enterprise) => {
        const matchKeyword = keyword 
          ? enterprise.name.includes(keyword) || enterprise.code.includes(keyword)
          : true
        const matchProvince = province
          ? enterprise.contact.address.includes(province)
          : true
        const matchCity = city
          ? enterprise.contact.address.includes(city)
          : true
        return matchKeyword && matchProvince && matchCity
      })
    }

    // 应用排序
    if (sortField && sortOrder) {
      enterprises.sort((a: Enterprise, b: Enterprise) => {
        const aValue = a[sortField as keyof Enterprise] ?? ''
        const bValue = b[sortField as keyof Enterprise] ?? ''
        return sortOrder === 'ascend'
          ? String(aValue) > String(bValue) ? 1 : -1
          : String(aValue) < String(bValue) ? 1 : -1
      })
    }

    // 应用分页
    const total = enterprises.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = enterprises.slice(start, end)

    const response: APIResponse<typeof items> = {
      code: 200,
      message: 'success',
      data: items,
      pagination: {
        current: page,
        pageSize,
        total
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

// POST /api/enterprises
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const now = new Date().toISOString()

    const enterprise = database.create<Enterprise>('enterprise', {
      ...body,
      id: String(Date.now()),
      createdAt: now,
      updatedAt: now
    })

    const response: APIResponse<typeof enterprise> = {
      code: 200,
      message: 'success',
      data: enterprise
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