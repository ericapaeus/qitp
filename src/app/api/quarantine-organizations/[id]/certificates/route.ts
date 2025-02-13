import { NextResponse } from 'next/server';

const mockCertificates = Array.from({ length: 10 }, (_, index) => ({
  id: `${index + 1}`,
  type: ['QUALIFICATION', 'LICENSE', 'APPROVAL'][Math.floor(Math.random() * 3)],
  name: [
    '检疫机构资质证书',
    '检疫许可证',
    '检疫机构批准文件',
    '实验室认证证书',
    '质量管理体系认证证书',
  ][Math.floor(Math.random() * 5)],
  number: `CERT${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
  issueDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  status: ['VALID', 'EXPIRED', 'REVOKED'][Math.floor(Math.random() * 3)],
  fileUrl: 'https://example.com/sample.pdf',
}));

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        items: mockCertificates,
        total: mockCertificates.length,
      },
    });
  } catch (error) {
    console.error('Failed to fetch certificates:', error);
    return NextResponse.json(
      {
        code: 500,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        {
          code: 400,
          message: 'No file uploaded',
        },
        { status: 400 }
      );
    }

    // 模拟文件上传
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        id: String(mockCertificates.length + 1),
        type: 'QUALIFICATION',
        name: '新上传的证书',
        number: `CERT${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'VALID',
        fileUrl: 'https://example.com/sample.pdf',
      },
    });
  } catch (error) {
    console.error('Failed to upload certificate:', error);
    return NextResponse.json(
      {
        code: 500,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; certificateId: string } }
) {
  try {
    // 模拟删除操作
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      code: 200,
      message: 'success',
    });
  } catch (error) {
    console.error('Failed to delete certificate:', error);
    return NextResponse.json(
      {
        code: 500,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
} 