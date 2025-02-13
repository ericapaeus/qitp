import { NextResponse } from 'next/server';

// 模拟数据
const mockRatingHistory = [
  {
    id: '1',
    oldScore: 3.5,
    newScore: 4.5,
    oldLevel: 'B',
    newLevel: 'A',
    reason: '机构在过去三个月内显著改善了隔离管理水平，特别是在人员管理和设施配备方面有明显提升。新增了智能监控系统，提高了管理效率。',
    operator: '李四',
    operateDate: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    oldScore: 4.5,
    newScore: 3.5,
    oldLevel: 'A',
    newLevel: 'B',
    reason: '近期检查发现部分设施老化，且人员培训不够及时。建议加强设施维护和人员培训力度。',
    operator: '王五',
    operateDate: '2024-02-15T14:30:00Z',
  },
  {
    id: '3',
    oldScore: 3.0,
    newScore: 3.5,
    oldLevel: 'C',
    newLevel: 'B',
    reason: '机构积极响应整改建议，完成了基础设施升级，并制定了完善的人员培训计划。',
    operator: '赵六',
    operateDate: '2024-01-10T09:15:00Z',
  },
];

// GET 方法获取机构评级历史
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        items: mockRatingHistory,
        total: mockRatingHistory.length,
      },
    });
  } catch (error) {
    console.error('Failed to fetch rating history:', error);
    return NextResponse.json(
      {
        code: 500,
        message: '获取评级历史失败',
      },
      { status: 500 }
    );
  }
} 