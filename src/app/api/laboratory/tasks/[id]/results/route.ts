import { NextRequest, NextResponse } from 'next/server'
import type { SubmitResultRequest, Result } from '@/types/api/laboratory'
import { tasks } from '@/mocks/data/laboratory/tasks'
import { results } from '@/mocks/data/laboratory/results'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as SubmitResultRequest
    const task = tasks.find(t => t.id === params.id)
    
    if (!task) {
      return NextResponse.json(
        { error: '任务不存在' },
        { status: 404 }
      )
    }

    if (!task.inspector) {
      return NextResponse.json(
        { error: '任务未分配检验员' },
        { status: 400 }
      )
    }

    const result: Result = {
      id: Date.now().toString(),
      registrationNo: task.registrationNo,
      plantName: task.plantName,
      symptom: task.symptom,
      inspectionDate: new Date().toISOString(),
      inspector: task.inspector,
      method: body.method,
      findings: body.findings,
      conclusion: body.conclusion,
      reviewStatus: 'PENDING',
      attachments: body.attachments || []
    }
    
    results.push(result)
    task.status = 'completed'

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: '提交检验结果失败' },
      { status: 500 }
    )
  }
} 