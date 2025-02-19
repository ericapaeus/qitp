'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Building,
  Building2,
  TestTubes,
  BarChart3,
  Settings,
  Sprout,
  ListTodo,
  type LucideIcon,
  LayoutDashboard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { menuItems } from '@/config/menu'

// 定义子菜单项类型
interface SubMenuItem {
  title: string
  href: string
}

// 定义菜单项类型
interface MenuItem {
  title: string
  icon: LucideIcon
  href: string
  items?: SubMenuItem[]
}

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <div className="w-64 border-r bg-white">
      <ScrollArea className="h-screen">
        <div className="space-y-4 p-4">
          {menuItems.map((item) => (
            <div key={item.href} className="space-y-2">
              {/* 一级菜单 */}
              <Link
                href={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md hover:bg-gray-100',
                  isActive(item.href) && 'bg-primary/10'
                )}
              >
                <h2 className={cn(
                  'flex items-center gap-2 font-medium',
                  isActive(item.href) ? 'text-primary' : 'text-gray-500'
                )}>
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </h2>
              </Link>

              {/* 二级菜单 */}
              {item.items && (
                <div className="space-y-1 pl-6">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        'block rounded-md px-3 py-2 text-sm hover:bg-gray-100',
                        isActive(subItem.href) && 'bg-primary/10 font-medium text-primary'
                      )}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 