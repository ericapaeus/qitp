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

// 菜单配置
const menuItems: MenuItem[] = [
  {
    title: '工作台',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    title: '隔离试种',
    icon: Sprout,
    href: '/isolation',
    items: [
      { title: '工作台', href: '/isolation/dashboard' },
      { title: '预约送样', href: '/isolation/appointments' },
      { title: '样品管理', href: '/isolation/samples' },
      { title: '待办任务', href: '/isolation/tasks' },
      { title: '检疫文书', href: '/isolation/certificates' }
    ]
  },
  {
    title: '实验室检验',
    icon: TestTubes,
    href: '/laboratory',
    items: [
      { title: '工作台', href: '/laboratory/dashboard' },
      { title: '检验任务', href: '/laboratory/tasks' },
      { title: '检验结果', href: '/laboratory/results' }
    ]
  },
  {
    title: '检疫机构',
    icon: Building2,
    href: '/quarantine-organizations',
    items: [
      { title: '机构管理', href: '/quarantine-organizations' },
      { title: '人员管理', href: '/quarantine-organizations/staff' }
    ]
  },
  {
    title: '引种企业',
    icon: Building,
    href: '/enterprises',
    items: [
      { title: '企业管理', href: '/enterprises' },
      { title: '联系人管理', href: '/enterprises/contacts' }
    ]
  },
  {
    title: '数据分析',
    icon: BarChart3,
    href: '/analysis',
    items: [
      { title: '检疫统计', href: '/analysis/quarantine' },
      { title: '疫情分析', href: '/analysis/epidemics' }
    ]
  },
  {
    title: '系统设置',
    icon: Settings,
    href: '/settings',
    items: [
      { title: '用户管理', href: '/settings/users' },
      { title: '角色权限', href: '/settings/roles' },
      { title: '系统配置', href: '/settings/config' }
    ]
  }
]

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