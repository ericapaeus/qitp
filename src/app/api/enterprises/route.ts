import { NextResponse } from 'next/server';
import { formatDate } from '@/lib/utils';

const mockEnterprises = Array.from({ length: 50 }, (_, index) => ({
  id: `${index + 1}`,
  code: `ENT${String(index + 1).padStart(3, '0')}`,
  name: `示例企业${index + 1}`,
  contact: {
    address: `北京市海淀区示例路${index + 1}号`,
    person: `联系人${index + 1}`,
    phone: `1380013${String(index + 1).padStart(4, '0')}`,
  },
  status: index % 5 === 0 ? 'SUSPENDED' : 'ACTIVE',
  syncTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
}));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const isExport = searchParams.get('export') === 'true';

  let filteredData = [...mockEnterprises];

  if (keyword) {
    const lowercaseKeyword = keyword.toLowerCase();
    filteredData = filteredData.filter(
      item =>
        item.name.toLowerCase().includes(lowercaseKeyword) ||
        item.code.toLowerCase().includes(lowercaseKeyword)
    );
  }

  if (status && status !== 'ALL') {
    filteredData = filteredData.filter(item => item.status === status);
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    filteredData = filteredData.filter(item => {
      const syncTime = new Date(item.syncTime);
      return syncTime >= start && syncTime <= end;
    });
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  if (isExport) {
    // 模拟导出数据
    const headers = new Headers();
    headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    headers.append('Content-Disposition', `attachment; filename=enterprises_${formatDate(new Date(), 'YYYY-MM-DD')}.xlsx`);

    // 这里应该是真实的 Excel 文件内容
    // 为了演示，我们返回一个空的 ArrayBuffer
    return new Response(new ArrayBuffer(0), {
      status: 200,
      headers,
    });
  }

  const total = filteredData.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filteredData.slice(start, end);

  return NextResponse.json({
    code: 200,
    message: 'success',
    data: {
      list: data,
      total,
      page,
      pageSize,
    },
  });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'sync') {
    // 模拟同步操作
    await new Promise(resolve => setTimeout(resolve, 2000));
    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        syncCount: Math.floor(Math.random() * 10),
      },
    });
  }

  const body = await request.json();
  // 模拟保存操作
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json({
    code: 200,
    message: 'success',
    data: {
      ...body,
      id: body.id || String(mockEnterprises.length + 1),
      syncTime: new Date().toISOString(),
    },
  });
} 