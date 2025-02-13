import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={cn(
      "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container flex h-12 max-w-screen-2xl items-center justify-between">
        <div className="text-sm text-muted-foreground">
          © 2024 检疫隔离试种信息管理系统. All rights reserved.
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="text-sm text-muted-foreground">
          Version 1.0.0
        </div>
      </div>
    </footer>
  )
} 