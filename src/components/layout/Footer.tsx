import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={className}>
      <div className="text-center text-sm text-gray-500">
        <p>© 2024 检疫检测信息平台. All rights reserved.</p>
      </div>
    </footer>
  )
} 