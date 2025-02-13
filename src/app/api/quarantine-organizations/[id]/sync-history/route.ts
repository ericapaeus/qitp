import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  // 生成模拟数据
  const mockHistory = Array.from({ length: 20 }, (_, index) => ({
    id: `${index + 1}`,
    type: Math.random() > 0.5 ? 'ORGANIZATION' : 'STAFF',
    status: Math.random() > 0.2 ? 'SUCCESS' : 'FAILED',
    errorMessage: Math.random() > 0.8 ? '网络连接超时' : undefined,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  const total = mockHistory.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = mockHistory.slice(start, end);

  return NextResponse.json({
    code: 200,
    message: 'success',
    data: {
      items,
      total,
      page,
      pageSize,
    },
  });
} 