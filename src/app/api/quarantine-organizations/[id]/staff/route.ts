import { NextResponse } from 'next/server';

const mockStaff = Array.from({ length: 20 }, (_, index) => ({
  id: `${index + 1}`,
  organizationId: '1',
  name: `检疫员${index + 1}`,
  title: ['助理研究员', '副研究员', '研究员', '高级工程师'][Math.floor(Math.random() * 4)],
  specialties: Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => ['植物病理', '昆虫检疫', '杂草检疫', '实验室检测'][Math.floor(Math.random() * 4)]
  ),
  certifications: Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => {
      const issueDate = new Date(Date.now() - Math.random() * 1000 * 24 * 60 * 60 * 1000);
      return {
        type: ['植物检疫员证', '实验室检测证', '高级检疫师'][Math.floor(Math.random() * 3)],
        no: `CERT${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
        issueDate: issueDate.toISOString(),
        expiryDate: new Date(issueDate.getTime() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }
  ),
  status: ['ACTIVE', 'ON_LEAVE', 'SUSPENDED'][Math.floor(Math.random() * 3)],
  syncTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
}));

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const status = searchParams.get('status');
  const specialty = searchParams.get('specialty');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  let filteredData = [...mockStaff];

  if (keyword) {
    const lowercaseKeyword = keyword.toLowerCase();
    filteredData = filteredData.filter(
      item =>
        item.name.toLowerCase().includes(lowercaseKeyword) ||
        item.title.toLowerCase().includes(lowercaseKeyword)
    );
  }

  if (status && status !== 'ALL') {
    filteredData = filteredData.filter(item => item.status === status);
  }

  if (specialty) {
    filteredData = filteredData.filter(item => item.specialties.includes(specialty));
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
      id: String(mockStaff.length + 1),
      organizationId,
      syncTime: new Date().toISOString(),
    },
  });
} 