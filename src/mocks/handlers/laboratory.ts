import { rest } from 'msw'
import { addMinutes, subMinutes, format } from 'date-fns'

// 类型定义
type TaskStatus = 'pending' | 'in_progress' | 'completed'
type TaskPriority = 'high' | 'normal' | 'low'
type ConclusionType = 'PASS' | 'FAIL' | 'NEED_PROCESS'
type ReviewStatusType = 'PENDING' | 'APPROVED' | 'REJECTED'

interface Task {
  id: string
  registrationNo: string
  plantName: string
  symptom: string
  samplingDate: string
  priority: TaskPriority
  status: TaskStatus
  inspector: {
    id: string
    name: string
  } | null
}

interface Result {
  id: string
  registrationNo: string
  plantName: string
  symptom: string
  inspectionDate: string
  inspector: {
    id: string
    name: string
  }
  method: 'visual' | 'microscope' | 'culture' | 'molecular'
  findings: Array<{
    id: string
    type: string
    description: string
  }>
  conclusion: ConclusionType
  reviewStatus: ReviewStatusType
  reviewer?: {
    id: string
    name: string
    comments: string
  }
  attachments: Array<{
    id: string
    name: string
  }>
}

// 模拟数据
const tasks: Task[] = [
  {
    id: '1',
    registrationNo: 'BJ2024001',
    plantName: '水稻',
    symptom: '叶片出现褐色斑点，疑似真菌感染',
    samplingDate: '2024-02-17T10:00:00',
    priority: 'high',
    status: 'pending',
    inspector: null
  },
  {
    id: '2',
    registrationNo: 'BJ2024002',
    plantName: '玉米',
    symptom: '茎秆基部变色，生长受阻',
    samplingDate: '2024-02-17T11:30:00',
    priority: 'normal',
    status: 'in_progress',
    inspector: {
      id: '1',
      name: '张三'
    }
  }
]

const results: Result[] = [
  {
    id: '1',
    registrationNo: 'BJ2024001',
    plantName: '水稻',
    symptom: '叶片出现褐色斑点，疑似真菌感染',
    inspectionDate: '2024-02-17T10:00:00',
    inspector: {
      id: '1',
      name: '张三'
    },
    method: 'microscope',
    findings: [
      {
        id: '1',
        type: '真菌',
        description: '在叶片组织中发现褐斑病菌孢子'
      }
    ],
    conclusion: 'NEED_PROCESS',
    reviewStatus: 'PENDING',
    attachments: [
      { id: '1', name: '显微镜照片1.jpg' },
      { id: '2', name: '检验记录.pdf' }
    ]
  },
  {
    id: '2',
    registrationNo: 'BJ2024002',
    plantName: '玉米',
    symptom: '茎秆基部变色，生长受阻',
    inspectionDate: '2024-02-17T11:30:00',
    inspector: {
      id: '2',
      name: '李四'
    },
    method: 'culture',
    findings: [
      {
        id: '1',
        type: '细菌',
        description: '分离培养发现青枯病菌'
      }
    ],
    conclusion: 'FAIL',
    reviewStatus: 'APPROVED',
    reviewer: {
      id: '3',
      name: '王五',
      comments: '检验结果准确，建议按处理方案执行'
    },
    attachments: [
      { id: '1', name: '培养皿照片.jpg' },
      { id: '2', name: '检验报告.pdf' }
    ]
  }
]

export const laboratoryHandlers = [
  // 获取任务列表
  rest.get('/api/laboratory/tasks', (req, res, ctx) => {
    const status = req.url.searchParams.get('status')
    const priority = req.url.searchParams.get('priority')
    
    let filteredTasks = [...tasks]
    if (status && status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === status)
    }
    if (priority && priority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priority)
    }
    
    return res(ctx.json(filteredTasks))
  }),

  // 分配任务
  rest.patch('/api/laboratory/tasks/:id/assign', async (req, res, ctx) => {
    const { id } = req.params
    const body = await req.json()
    const task = tasks.find(t => t.id === id)
    
    if (!task) {
      return res(ctx.status(404))
    }

    task.inspector = {
      id: body.inspectorId,
      name: body.inspectorName
    }
    task.status = 'in_progress'

    return res(ctx.json(task))
  }),

  // 提交检验结果
  rest.post('/api/laboratory/tasks/:id/results', async (req, res, ctx) => {
    const { id } = req.params
    const body = await req.json()
    
    const result = {
      id: Date.now().toString(),
      ...body,
      reviewStatus: 'PENDING'
    }
    
    results.push(result)
    return res(ctx.json(result))
  }),

  // 获取结果列表
  rest.get('/api/laboratory/results', (req, res, ctx) => {
    const status = req.url.searchParams.get('status')
    const conclusion = req.url.searchParams.get('conclusion')
    
    let filteredResults = [...results]
    if (status && status !== 'all') {
      filteredResults = filteredResults.filter(result => result.reviewStatus === status)
    }
    if (conclusion && conclusion !== 'all') {
      filteredResults = filteredResults.filter(result => result.conclusion === conclusion)
    }
    
    return res(ctx.json(filteredResults))
  }),

  // 审核结果
  rest.patch('/api/laboratory/results/:id/review', async (req, res, ctx) => {
    const { id } = req.params
    const body = await req.json()
    const result = results.find(r => r.id === id)
    
    if (!result) {
      return res(ctx.status(404))
    }

    result.reviewStatus = body.approved ? 'APPROVED' : 'REJECTED'
    if (body.comments) {
      result.reviewer = {
        id: 'REVIEWER_ID', // 实际应该是当前用户ID
        name: 'REVIEWER_NAME', // 实际应该是当前用户名
        comments: body.comments
      }
    }

    return res(ctx.json(result))
  }),

  // 生成报告
  rest.post('/api/laboratory/results/:id/report', async (req, res, ctx) => {
    const { id } = req.params
    const result = results.find(r => r.id === id)
    
    if (!result) {
      return res(ctx.status(404))
    }

    if (result.reviewStatus !== 'APPROVED') {
      return res(
        ctx.status(400),
        ctx.text('Result must be approved before generating report')
      )
    }

    // 模拟生成报告
    const report = {
      id: Date.now().toString(),
      resultId: id,
      fileName: `检验报告_${result.registrationNo}.pdf`,
      url: '/reports/example.pdf'
    }

    return res(ctx.json(report))
  })
] 