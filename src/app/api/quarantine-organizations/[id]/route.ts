export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // 模拟从数据库获取记录
  const mockOrganization = {
    id,
    code: `QO${String(id).padStart(3, '0')}`,
    name: `示例检疫中心${id}`,
    level: Math.random() > 0.3 ? 'PROVINCE' : 'CITY',
    region: {
      province: '北京市',
      city: Math.random() > 0.3 ? '海淀区' : undefined,
    },
    contact: {
      address: `北京市海淀区示例路${id}号`,
      phone: `1380013${String(id).padStart(4, '0')}`,
      email: `example${id}@test.com`,
    },
    status: Math.random() > 0.2 ? 'ACTIVE' : 'SUSPENDED',
    syncTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  return Response.json({
    code: 200,
    message: 'success',
    data: mockOrganization,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await request.json();

  // 模拟更新操作
  await new Promise(resolve => setTimeout(resolve, 1000));

  return Response.json({
    code: 200,
    message: 'success',
    data: {
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // 模拟删除操作
  await new Promise(resolve => setTimeout(resolve, 1000));

  return Response.json({
    code: 200,
    message: 'success',
  });
} 