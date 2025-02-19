'use client'

import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, CircleDot } from 'lucide-react'

interface StepItem {
  title: string
  description?: string
  status: 'wait' | 'process' | 'finish'
}

interface StepsProps {
  items: StepItem[]
  current?: number
  className?: string
}

export function Steps({ items, current = 0, className }: StepsProps) {
  return (
    <div className={cn('flex w-full', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const status = 
          index < current ? 'finish' :
          index === current ? 'process' :
          'wait'

        return (
          <div
            key={index}
            className={cn(
              'flex-1 relative',
              !isLast && 'after:absolute after:top-4 after:left-1/2 after:w-full after:h-[1px] after:bg-border'
            )}
          >
            <div className="relative z-10 flex flex-col items-center group">
              <div className="w-8 h-8 flex items-center justify-center bg-background">
                {status === 'finish' ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : status === 'process' ? (
                  <CircleDot className="w-6 h-6 text-primary" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={cn(
                  'text-sm font-medium',
                  status === 'finish' && 'text-primary',
                  status === 'process' && 'text-primary',
                  status === 'wait' && 'text-muted-foreground'
                )}>
                  {item.title}
                </div>
                {item.description && (
                  <div className={cn(
                    'text-xs mt-1',
                    status === 'wait' ? 'text-muted-foreground' : 'text-gray-500'
                  )}>
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
} 