import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; staffId: string } }
) {
  const { id, staffId } = params;

  // 模拟删除操作
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json({
    code: 200,
    message: 'success',
  });
} 