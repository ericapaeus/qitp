import { interceptor } from './interceptor'
import { enterpriseHandlers } from './handlers/enterprises'
import { quarantineHandlers } from './handlers/quarantine'
import { isolationHandlers } from './handlers/isolation'
import { laboratoryHandlers } from './handlers/laboratory'
import { reportHandlers } from './handlers/reports'

// 注册所有路由
export function registerRoutes() {
  // 企业相关路由
  enterpriseHandlers.forEach(handler => {
    interceptor.register(handler.method, handler.path, handler.handler)
  })

  // 检疫相关路由
  quarantineHandlers.forEach(handler => {
    interceptor.register(handler.method, handler.path, handler.handler)
  })

  // 隔离相关路由
  isolationHandlers.forEach(handler => {
    interceptor.register(handler.method, handler.path, handler.handler)
  })

  // 实验室相关路由
  laboratoryHandlers.forEach(handler => {
    interceptor.register(handler.method, handler.path, handler.handler)
  })

  // 报告相关路由
  reportHandlers.forEach(handler => {
    interceptor.register(handler.method, handler.path, handler.handler)
  })
} 