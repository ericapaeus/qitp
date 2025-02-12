'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Building2,
  ClipboardCheck,
  TestTubes,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// 菜单配置
const menuItems = [
  {
    title: '首页',
    icon: Home,
    href: '/',
  },
  {
    title: '企业管理',
    icon: Building2,
    href: '/enterprises',
    items: [
      { title: '企业信息', href: '/enterprises' },
      { title: '引种记录', href: '/enterprises/imports' },
    ],
  },
  {
    title: '隔离试种',
    icon: ClipboardCheck,
    href: '/isolation',
    items: [
      { title: '样品接收', href: '/isolation/samples' },
      { title: '试种管理', href: '/isolation/plants' },
      { title: '检疫处理', href: '/isolation/quarantine' },
    ],
  },
  {
    title: '实验室检验',
    icon: TestTubes,
    href: '/laboratory',
    items: [
      { title: '检验任务', href: '/laboratory/tasks' },
      { title: '检验结果', href: '/laboratory/results' },
    ],
  },
  {
    title: '表单管理',
    icon: FileText,
    href: '/forms',
    items: [
      { title: '表单模板', href: '/forms/templates' },
      { title: '表单记录', href: '/forms/records' },
    ],
  },
  {
    title: '数据分析',
    icon: BarChart3,
    href: '/analysis',
    items: [
      { title: '统计报表', href: '/analysis/statistics' },
      { title: '数据导出', href: '/analysis/export' },
    ],
  },
  {
    title: '系统设置',
    icon: Settings,
    href: '/settings',
    items: [
      { title: '用户管理', href: '/settings/users' },
      { title: '角色权限', href: '/settings/roles' },
      { title: '基础数据', href: '/settings/base-data' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openMenus, setOpenMenus] = useState<string[]>([])

  // 切换子菜单展开/折叠
  const toggleMenu = (href: string) => {
    setOpenMenus((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    )
  }

  // 判断菜单项是否激活
  const isActive = (href: string) => pathname === href

  // 判断菜单组是否有激活项
  const hasActiveChild = (items?: { href: string }[]) =>
    items?.some((item) => pathname === item.href)

  return (
    <aside
      className={cn(
        'fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300',
        isCollapsed ? 'w-[72px]' : 'w-[280px]'
      )}
    >
      <div className="h-full flex flex-col">
        {/* 菜单列表 */}
        <nav className="flex-1 overflow-y-auto py-6">
          {menuItems.map((item) => (
            <div key={item.href}>
              {/* 主菜单项 */}
              <div
                className={cn(
                  'flex items-center h-11 px-3 mx-3 rounded-lg cursor-pointer',
                  (isActive(item.href) || hasActiveChild(item.items)) &&
                    'bg-gray-100',
                  'hover:bg-gray-50'
                )}
                onClick={() => item.items && toggleMenu(item.href)}
              >
                <item.icon className="h-5 w-5 text-gray-500" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3 text-sm">{item.title}</span>
                    {item.items && (
                      <ChevronRight
                        className={cn(
                          'ml-auto h-4 w-4 text-gray-400 transition-transform',
                          openMenus.includes(item.href) && 'rotate-90'
                        )}
                      />
                    )}
                  </>
                )}
              </div>

              {/* 子菜单项 */}
              {!isCollapsed &&
                item.items &&
                openMenus.includes(item.href) &&
                item.items.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      'flex items-center h-10 pl-11 pr-3 text-sm',
                      isActive(subItem.href)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
            </div>
          ))}
        </nav>

        {/* 折叠按钮 */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
      </div>
    </aside>
  )
} 