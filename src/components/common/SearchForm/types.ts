import { SearchField } from '@/types/common'

/**
 * 搜索表单属性
 */
export interface SearchFormProps {
  // 搜索字段配置
  fields: SearchField[]
  // 初始值
  initialValues?: Record<string, any>
  // 提交回调
  onSubmit: (values: Record<string, any>) => void
  // 重置回调
  onReset?: () => void
  // 是否显示重置按钮
  showReset?: boolean
  // 是否显示展开/收起
  collapsible?: boolean
  // 默认是否展开
  defaultCollapsed?: boolean
  // 每行显示的字段数
  columns?: number
  // 自定义类名
  className?: string
  // 加载状态
  loading?: boolean
} 