import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  fullscreen?: boolean
}

/**
 * 加载动画组件
 */
export function LoadingSpinner({
  className,
  size = 'md',
  fullscreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  const spinner = (
    <div
      className={cn(
        'inline-block rounded-full border-primary border-solid border-t-transparent animate-spin',
        sizeClasses[size],
        className
      )}
    />
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner 