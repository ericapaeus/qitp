import { NextRequest, NextResponse } from 'next/server'
import type { ReviewResultRequest } from '@/types/api/laboratory'
import { results } from '@/mocks/data/laboratory/results'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as ReviewResultRequest
    const result = results.find(r => r.id === params.id)
    
    if (!result) {
      return NextResponse.json(
        { error: '检验结果不存在' },
        { status: 404 }
      )
    }

    result.reviewStatus = body.approved ? 'APPROVED' : 'REJECTED'
    if (body.comments) {
      result.reviewer = {
        id: 'REVIEWER_ID', // 实际应该是当前用户ID
        name: 'REVIEWER_NAME', // 实际应该是当前用户名
        comments: body.comments
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: '审核结果失败' },
      { status: 500 }
    )
  }
} 