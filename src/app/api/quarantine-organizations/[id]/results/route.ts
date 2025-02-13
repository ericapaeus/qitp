import { NextResponse } from 'next/server';

const mockResults = Array.from({ length: 50 }, (_, index) => ({
  id: `${index + 1}`,
  organizationId: '1',
  taskId: String(Math.floor(Math.random() * 100) + 1),
  conclusion: ['PASS', 'FAIL', 'NEED_PROCESS'][Math.floor(Math.random() * 3)],
  inspector: {
    id: String(Math.floor(Math.random() * 10) + 1),
    name: `检疫员${Math.floor(Math.random() * 10) + 1}`,
  },
  subject: {
    type: ['种子', '种苗', '植物组织'][Math.floor(Math.random() * 3)],
    name: ['小麦', '水稻', '玉米', '大豆'][Math.floor(Math.random() * 4)],
    quantity: Math.floor(Math.random() * 1000) + 100,
    unit: ['kg', 'g', '株'][Math.floor(Math.random() * 3)],
  },
  findings: Array.from(
    { length: Math.floor(Math.random() * 3) },
    () => ({
      type: ['PEST', 'DISEASE', 'WEED', 'OTHER'][Math.floor(Math.random() * 4)],
      name: [
        '稻瘟病',
        '小麦锈病',
        '玉米螟',
        '稗草',
        '麦长管蚜',
        '水稻条纹叶枯病',
      ][Math.floor(Math.random() * 6)],
      level: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
      description: '在样品中发现该有害生物，需要进行相应处理。',
    })
  ),
  processingMethod: Math.random() > 0.7 ? '进行药剂处理，并在隔离期间持续观察。' : undefined,
  inspectionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
}));

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const conclusion = searchParams.get('conclusion');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  let filteredData = [...mockResults];

  if (keyword) {
    const lowercaseKeyword = keyword.toLowerCase();
    filteredData = filteredData.filter(
      item =>
        item.subject.name.toLowerCase().includes(lowercaseKeyword) ||
        item.inspector.name.toLowerCase().includes(lowercaseKeyword)
    );
  }

  if (conclusion && conclusion !== 'ALL') {
    filteredData = filteredData.filter(item => item.conclusion === conclusion);
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    filteredData = filteredData.filter(item => {
      const inspectionDate = new Date(item.inspectionDate);
      return inspectionDate >= start && inspectionDate <= end;
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
      id: String(mockResults.length + 1),
      organizationId,
      createdAt: new Date().toISOString(),
    },
  });
} 