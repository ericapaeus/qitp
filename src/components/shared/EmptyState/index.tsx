import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FileX, Plus, RefreshCw } from 'lucide-react'

interface EmptyStateProps {
  className?: string
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  showRefresh?: boolean
  onRefresh?: () => void
}

/**
 * 空状态组件
 */
export function EmptyState({
  className,
  icon = <FileX className="w-12 h-12 text-gray-400" />,
  title = '暂无数据',
  description = '当前列表为空',
  action,
  showRefresh = false,
  onRefresh,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        className
      )}
    >
      {icon}
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      <div className="mt-6 space-x-3">
        {action && (
          <Button onClick={action.onClick}>
            <Plus className="w-4 h-4 mr-2" />
            {action.label}
          </Button>
        )}
        {showRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
        )}
      </div>
    </div>
  )
}

export default EmptyState 