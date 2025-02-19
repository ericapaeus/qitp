import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/mocks/db'
import { APIResponse } from '@/types/api'

// GET /api/enterprises/imports
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = Number(searchParams.get('page')) || 1
    const pageSize = Number(searchParams.get('pageSize')) || 10
    const enterpriseId = searchParams.get('enterpriseId')
    const startTime = searchParams.get('startTime')
    const endTime = searchParams.get('endTime')
    const status = searchParams.get('status')

    // 获取所有导入记录
    let applications = db.importApplication.getAll()

    // 应用过滤
    if (enterpriseId || startTime || endTime || status) {
      applications = applications.filter(app => {
        const matchEnterprise = enterpriseId
          ? app.enterpriseId === enterpriseId
          : true
        const matchTimeRange = startTime && endTime
          ? new Date(app.createdAt) >= new Date(startTime) && 
            new Date(app.createdAt) <= new Date(endTime)
          : true
        const matchStatus = status
          ? app.status === status
          : true
        return matchEnterprise && matchTimeRange && matchStatus
      })
    }

    // 应用分页
    const total = applications.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = applications.slice(start, end)

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

// POST /api/enterprises/imports
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const now = new Date().toISOString()

    const application = db.importApplication.create({
      ...body,
      id: String(Date.now()),
      status: 'PENDING',
      createdAt: now,
      updatedAt: now
    })

    const response: APIResponse<typeof application> = {
      code: 200,
      message: 'success',
      data: application
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

// PATCH /api/enterprises/imports/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const now = new Date().toISOString()

    const application = db.importApplication.update({
      where: { id: { equals: String(params.id) } },
      data: {
        ...body,
        updatedAt: now
      }
    })

    const response: APIResponse<typeof application> = {
      code: 200,
      message: 'success',
      data: application
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

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({
      code: 400,
      message: 'Missing record ID',
    });
  }

  // 模拟删除操作
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json({
    code: 200,
    message: 'success',
  });
} 