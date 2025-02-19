import { NextRequest, NextResponse } from 'next/server'
import type { AssignTaskRequest } from '@/types/api/laboratory'
import { tasks } from '@/mocks/data/laboratory/tasks'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as AssignTaskRequest
    const task = tasks.find(t => t.id === params.id)
    
    if (!task) {
      return NextResponse.json(
        { error: '任务不存在' },
        { status: 404 }
      )
    }

    task.inspector = {
      id: body.inspectorId,
      name: 'INSPECTOR_NAME' // 实际应该从用户系统获取
    }
    task.status = 'in_progress'

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json(
      { error: '分配任务失败' },
      { status: 500 }
    )
  }
} 