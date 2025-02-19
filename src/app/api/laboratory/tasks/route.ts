import { NextResponse } from 'next/server'
import type { Task } from '@/types/api/laboratory'
import { tasks } from '@/mocks/data/laboratory/tasks'

export async function GET() {
  try {
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: '获取任务列表失败' },
      { status: 500 }
    )
  }
} 