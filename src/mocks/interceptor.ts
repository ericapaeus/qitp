import { NextRequest, NextResponse } from 'next/server'

type Handler = (request: NextRequest, params: Record<string, string>) => Promise<NextResponse>

interface Route {
  pattern: RegExp
  method: string
  handler: Handler
}

class APIInterceptor {
  private routes: Route[] = []

  register(method: string, path: string, handler: Handler) {
    // 将路径参数转换为正则表达式
    const pattern = new RegExp(
      '^' + path.replace(/:[^/]+/g, '([^/]+)') + '/?$'
    )
    this.routes.push({ pattern, method, handler })
  }

  async handle(request: NextRequest) {
    const method = request.method
    const path = new URL(request.url).pathname.replace(/^\/api/, '')

    for (const route of this.routes) {
      if (route.method === method) {
        const matches = path.match(route.pattern)
        if (matches) {
          // 提取路径参数
          const params: Record<string, string> = {}
          const paramNames = route.pattern.toString()
            .match(/:[^/]+/g)
            ?.map(p => p.slice(1))
          
          if (paramNames) {
            paramNames.forEach((name, index) => {
              params[name] = matches[index + 1]
            })
          }

          try {
            return await route.handler(request, params)
          } catch (error) {
            console.error('API Error:', error)
            return NextResponse.json(
              {
                code: 500,
                message: error instanceof Error ? error.message : '未知错误'
              },
              { status: 500 }
            )
          }
        }
      }
    }

    return NextResponse.json(
      {
        code: 404,
        message: 'Not Found'
      },
      { status: 404 }
    )
  }
}

export const interceptor = new APIInterceptor()

// 工具函数：解析查询参数
export function parseQuery(request: NextRequest) {
  const url = new URL(request.url)
  return Object.fromEntries(url.searchParams)
}

// 工具函数：解析请求体
export async function parseBody<T>(request: NextRequest): Promise<T> {
  const contentType = request.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return request.json()
  }
  throw new Error('Unsupported content type')
}

// 工具函数：创建响应
export function createResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      code: status,
      message: status === 200 ? 'success' : 'error',
      data
    },
    { status }
  )
} 