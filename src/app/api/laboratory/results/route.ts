import { NextResponse } from 'next/server'
import type { Result } from '@/types/api/laboratory'
import { results } from '@/mocks/data/laboratory/results'

export async function GET() {
  try {
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      { error: '获取检验结果失败' },
      { status: 500 }
    )
  }
} 