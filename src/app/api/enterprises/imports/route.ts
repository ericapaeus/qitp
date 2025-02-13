import { NextResponse } from 'next/server';
import { formatDate } from '@/lib/utils';

const mockImportRecords = Array.from({ length: 50 }, (_, index) => ({
  id: `${index + 1}`,
  enterpriseId: `${Math.floor(Math.random() * 10) + 1}`,
  enterpriseName: `示例企业${Math.floor(Math.random() * 10) + 1}`,
  approvalNo: `AP${String(2024000 + index + 1)}`,
  plant: {
    name: ['小麦', '水稻', '玉米', '大豆'][Math.floor(Math.random() * 4)],
    scientificName: 'Triticum aestivum',
    variety: `品种${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    sourceCountry: ['美国', '加拿大', '澳大利亚', '法国'][Math.floor(Math.random() * 4)],
    quantity: Math.floor(Math.random() * 1000) + 100,
    unit: ['kg', 'g', '株'][Math.floor(Math.random() * 3)],
    purpose: ['科研', '生产', '育种'][Math.floor(Math.random() * 3)],
  },
  importInfo: {
    entryPort: ['青岛港', '天津港', '上海港', '广州港'][Math.floor(Math.random() * 4)],
    plannedDate: formatDate(new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)),
    actualDate: Math.random() > 0.5
      ? formatDate(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000))
      : undefined,
  },
  isolationInfo: Math.random() > 0.3 ? {
    facilityId: `F${Math.floor(Math.random() * 10) + 1}`,
    startDate: formatDate(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)),
    endDate: Math.random() > 0.5
      ? formatDate(new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000))
      : undefined,
  } : undefined,
  status: ['PENDING', 'IMPORTING', 'ISOLATING', 'COMPLETED'][Math.floor(Math.random() * 4)],
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
}));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  let filteredData = [...mockImportRecords];

  if (keyword) {
    const lowercaseKeyword = keyword.toLowerCase();
    filteredData = filteredData.filter(
      item =>
        item.enterpriseName.toLowerCase().includes(lowercaseKeyword) ||
        item.approvalNo.toLowerCase().includes(lowercaseKeyword)
    );
  }

  if (status && status !== 'ALL') {
    filteredData = filteredData.filter(item => item.status === status);
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    filteredData = filteredData.filter(item => {
      const plannedDate = new Date(item.importInfo.plannedDate);
      return plannedDate >= start && plannedDate <= end;
    });
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));

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
  const body = await request.json();
  
  // 模拟保存操作
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newRecord = {
    ...body,
    id: String(mockImportRecords.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    code: 200,
    message: 'success',
    data: newRecord,
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  
  // 模拟更新操作
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json({
    code: 200,
    message: 'success',
    data: {
      ...body,
      updatedAt: new Date().toISOString(),
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({
      code: 400,
      message: 'Missing record ID',
    });
  }

  // 模拟删除操作
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json({
    code: 200,
    message: 'success',
  });
} 