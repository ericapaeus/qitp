import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // 模拟同步操作
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 模拟同步结果
    const syncResult = {
      syncCount: Math.floor(Math.random() * 10) + 1,
      details: {
        organization: true,
        staff: Math.random() > 0.2,
        tasks: Math.random() > 0.2,
        results: Math.random() > 0.2,
      },
    };

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: syncResult,
    });
  } catch (error) {
    console.error('Failed to sync organization:', error);
    return NextResponse.json(
      {
        code: 500,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
} 