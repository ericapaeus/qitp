import { formatDate } from '@/lib/utils';

const mockOrganizations = Array.from({ length: 50 }, (_, index) => ({
  id: `${index + 1}`,
  code: `QO${String(index + 1).padStart(3, '0')}`,
  name: `${['北京市', '上海市', '广东省', '江苏省', '浙江省'][Math.floor(Math.random() * 5)]}检疫中心${index + 1}`,
  level: Math.random() > 0.3 ? 'PROVINCE' : 'CITY',
  region: {
    province: ['北京市', '上海市', '广东省', '江苏省', '浙江省'][Math.floor(Math.random() * 5)],
    city: Math.random() > 0.3 ? ['南京市', '苏州市', '杭州市', '宁波市', '广州市'][Math.floor(Math.random() * 5)] : undefined,
  },
  contact: {
    address: `示例地址${index + 1}号`,
    phone: `1380013${String(index + 1).padStart(4, '0')}`,
    email: `example${index + 1}@test.com`,
  },
  status: Math.random() > 0.2 ? 'ACTIVE' : 'SUSPENDED',
  syncTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
}));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const level = searchParams.get('level');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  let filteredData = [...mockOrganizations];

  if (keyword) {
    const lowercaseKeyword = keyword.toLowerCase();
    filteredData = filteredData.filter(
      item =>
        item.name.toLowerCase().includes(lowercaseKeyword) ||
        item.code.toLowerCase().includes(lowercaseKeyword)
    );
  }

  if (level && level !== 'ALL') {
    filteredData = filteredData.filter(item => item.level === level);
  }

  if (status && status !== 'ALL') {
    filteredData = filteredData.filter(item => item.status === status);
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  const total = filteredData.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = filteredData.slice(start, end);

  return Response.json({
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

export async function POST(request: Request) {
  const body = await request.json();
  
  // 模拟保存操作
  await new Promise(resolve => setTimeout(resolve, 1000));

  return Response.json({
    code: 200,
    message: 'success',
    data: {
      ...body,
      id: String(mockOrganizations.length + 1),
      syncTime: new Date().toISOString(),
    },
  });
} 