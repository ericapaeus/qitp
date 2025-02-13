// 模拟数据
const mockRating = {
  id: '1',
  score: 4.5,
  level: 'A',
  comment: '该机构在隔离管理方面表现优秀，各项指标均达到或超过标准要求。特别是在人员管理、设施配备和应急处置等方面表现突出。建议继续保持现有水平，并在信息化建设方面进一步加强。',
  evaluator: '张三',
  evaluateDate: '2024-03-20T10:00:00Z',
};

// GET 方法获取机构评级
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    return Response.json({
      code: 200,
      message: 'success',
      data: mockRating,
    });
  } catch (error) {
    console.error('Failed to fetch rating:', error);
    return Response.json(
      {
        code: 500,
        message: '获取评级失败',
      },
      { status: 500 }
    );
  }
}

// POST 方法更新机构评级
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { score, level, comment } = body;

    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模拟保存评级
    const newRating = {
      id: '1',
      score,
      level,
      comment,
      evaluator: '张三',
      evaluateDate: new Date().toISOString(),
    };

    return Response.json({
      code: 200,
      message: 'success',
      data: newRating,
    });
  } catch (error) {
    console.error('Failed to update rating:', error);
    return Response.json(
      {
        code: 500,
        message: '更新评级失败',
      },
      { status: 500 }
    );
  }
} 