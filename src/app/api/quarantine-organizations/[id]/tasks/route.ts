import { NextResponse } from 'next/server';

const mockTasks = Array.from({ length: 50 }, (_, index) => ({
  id: `${index + 1}`,
  organizationId: '1',
  type: ['PRELIMINARY', 'ISOLATION', 'LABORATORY'][Math.floor(Math.random() * 3)],
  status: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'][Math.floor(Math.random() * 4)],
  priority: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
  assignee: {
    id: String(Math.floor(Math.random() * 10) + 1),
    name: `检疫员${Math.floor(Math.random() * 10) + 1}`,
  },
  subject: {
    type: ['种子', '种苗', '植物组织'][Math.floor(Math.random() * 3)],
    name: ['小麦', '水稻', '玉米', '大豆'][Math.floor(Math.random() * 4)],
    quantity: Math.floor(Math.random() * 1000) + 100,
    unit: ['kg', 'g', '株'][Math.floor(Math.random() * 3)],
  },
  progress: Math.floor(Math.random() * 100),
  startDate: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  endDate: Math.random() > 0.7 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
}));

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  let filteredData = [...mockTasks];

  if (keyword) {
    const lowercaseKeyword = keyword.toLowerCase();
    filteredData = filteredData.filter(
      item =>
        item.subject.name.toLowerCase().includes(lowercaseKeyword) ||
        item.assignee.name.toLowerCase().includes(lowercaseKeyword)
    );
  }

  if (type && type !== 'ALL') {
    filteredData = filteredData.filter(item => item.type === type);
  }

  if (status && status !== 'ALL') {
    filteredData = filteredData.filter(item => item.status === status);
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    filteredData = filteredData.filter(item => {
      if (!item.startDate) return false;
      const taskDate = new Date(item.startDate);
      return taskDate >= start && taskDate <= end;
    });
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  const total = filteredData.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = filteredData.slice(start, end);

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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const organizationId = params.id;
  const body = await request.json();

  // 模拟保存操作
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json({
    code: 200,
    message: 'success',
    data: {
      ...body,
      id: String(mockTasks.length + 1),
      organizationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });
} 