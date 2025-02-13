import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // 获取当年的起止时间
    const now = new Date();
    const startDate = new Date(now.getFullYear(), 0, 1);
    const endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

    // 模拟统计数据
    const mockStatistics = {
      organizationId: id,
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      taskCount: {
        total: Math.floor(Math.random() * 1000) + 100,
        preliminary: Math.floor(Math.random() * 500) + 50,
        isolation: Math.floor(Math.random() * 300) + 30,
        laboratory: Math.floor(Math.random() * 200) + 20,
      },
      resultCount: {
        total: Math.floor(Math.random() * 800) + 80,
        pass: Math.floor(Math.random() * 600) + 60,
        fail: Math.floor(Math.random() * 100) + 10,
        needProcess: Math.floor(Math.random() * 100) + 10,
      },
      staffCount: {
        total: Math.floor(Math.random() * 50) + 10,
        active: Math.floor(Math.random() * 40) + 8,
      },
    };

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: mockStatistics,
    });
  } catch (error) {
    console.error('Failed to fetch organization statistics:', error);
    return NextResponse.json(
      {
        code: 500,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
} 