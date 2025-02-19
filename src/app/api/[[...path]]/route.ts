import { NextRequest } from 'next/server'
import { interceptor } from '@/mocks/interceptor'
import { registerRoutes } from '@/mocks/routes'

// 注册所有路由
registerRoutes()

// 处理所有 API 请求
export async function GET(request: NextRequest) {
  return interceptor.handle(request)
}

export async function POST(request: NextRequest) {
  return interceptor.handle(request)
}

export async function PUT(request: NextRequest) {
  return interceptor.handle(request)
}

export async function PATCH(request: NextRequest) {
  return interceptor.handle(request)
}

export async function DELETE(request: NextRequest) {
  return interceptor.handle(request)
} 