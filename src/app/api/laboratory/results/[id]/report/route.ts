import { NextResponse } from 'next/server'
import type { GenerateReportResponse } from '@/types/api/laboratory'
import { results } from '@/mocks/data/laboratory/results'
import { format } from 'date-fns'

// 模拟从其他模块获取数据
async function getIsolationData(registrationNo: string) {
  // 实际应该从隔离检疫接样登记表获取
  return {
    approvalNo: 'AP' + registrationNo,
    samplingInfo: {
      location: '茎秆基部',
      quantity: '3株',
      time: '2024-02-17 10:00',
      sampler: '张三'
    },
    submissionInfo: {
      time: '2024-02-17 10:30',
      sampleNo: 'S' + registrationNo
    }
  }
}

// 模拟获取系统配置
async function getLabConfig() {
  return {
    labManager: '王主任',
    labName: '植物检疫实验室'
  }
}

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = results.find(r => r.id === params.id)
    
    if (!result) {
      return NextResponse.json(
        { error: '检验结果不存在' },
        { status: 404 }
      )
    }

    if (result.reviewStatus !== 'APPROVED') {
      return NextResponse.json(
        { error: '检验结果未通过审核，无法生成报告' },
        { status: 400 }
      )
    }

    // 获取关联数据
    const isolationData = await getIsolationData(result.registrationNo)
    const labConfig = await getLabConfig()

    // 格式化检验发现
    const formattedFindings = [
      `可疑症状：${result.symptom}`,
      '',
      '检验发现：',
      ...result.findings.map((finding, index) => 
        `${index + 1}. ${finding.type}：${finding.description}`
      ),
      '',
      result.reviewer ? `审核意见：${result.reviewer.comments}（${result.reviewer.name}）` : ''
    ].filter(Boolean).join('\\n')

    // 生成标准格式的报告
    const report: GenerateReportResponse = {
      id: Date.now().toString(),
      resultId: result.id,
      
      // 基本信息
      registrationNo: result.registrationNo,
      approvalNo: isolationData.approvalNo,
      plantName: result.plantName,
      sampleNo: isolationData.submissionInfo.sampleNo,
      
      // 采样信息
      samplingLocation: isolationData.samplingInfo.location,
      samplingQuantity: isolationData.samplingInfo.quantity,
      samplingTime: isolationData.samplingInfo.time,
      sampler: isolationData.samplingInfo.sampler,
      
      // 检验信息
      submissionTime: isolationData.submissionInfo.time,
      inspectionTime: format(new Date(result.inspectionDate), 'yyyy-MM-dd HH:mm'),
      method: result.method === 'visual' ? '目视检查' :
              result.method === 'microscope' ? '显微镜检查' :
              result.method === 'culture' ? '培养检查' :
              '分子生物学检测',
      findings: formattedFindings,
      
      // 人员信息
      inspector: result.inspector.name,
      labManager: labConfig.labManager,
      
      // 报告元数据
      date: format(new Date(), 'yyyy年MM月dd日'),
      fileName: `检验报告_${result.registrationNo}.pdf`,
      url: '/reports/example.pdf'
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('Generate report error:', error)
    return NextResponse.json(
      { error: '生成报告失败' },
      { status: 500 }
    )
  }
} 