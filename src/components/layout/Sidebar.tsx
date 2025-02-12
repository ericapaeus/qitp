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
  Building,
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
    title: '检疫机构',
    icon: Building,
    href: '/quarantine',
    items: [
      { title: '机构信息', href: '/quarantine/organizations' },
      { title: '检疫人员', href: '/quarantine/staff' },
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

interface SidebarProps {
  isCollapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

export default function Sidebar({ isCollapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname()
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
        'fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] transition-all duration-300 z-40',
        isCollapsed ? 'w-[var(--sidebar-width-collapsed)]' : 'w-[var(--sidebar-width)]',
        'shadow-[var(--shadow-md)]'
      )}
    >
      <div className="h-full flex flex-col">
        {/* 菜单列表 */}
        <nav className="flex-1 overflow-y-auto py-6 sidebar">
          {menuItems.map((item) => (
            <div key={item.href}>
              {/* 主菜单项 */}
              {item.items ? (
                // 有子菜单的情况
                <div
                  className={cn(
                    'flex items-center h-[44px] px-6 gap-3 cursor-pointer relative text-[14px] text-[#64748B]',
                    'transition-all duration-200',
                    (isActive(item.href) || hasActiveChild(item.items)) && [
                      'bg-[#F8FAFC] text-[#2D3748] font-medium',
                      'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#5E72E4]',
                    ],
                    'hover:bg-[#F1F5F9]'
                  )}
                  onClick={() => toggleMenu(item.href)}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <>
                      <span>{item.title}</span>
                      <ChevronRight
                        className={cn(
                          'ml-auto h-4 w-4 text-gray-400 transition-transform duration-200',
                          openMenus.includes(item.href) && 'rotate-90'
                        )}
                      />
                    </>
                  )}
                </div>
              ) : (
                // 没有子菜单的情况（如首页）
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center h-[44px] px-6 gap-3 relative text-[14px] text-[#64748B]',
                    'transition-all duration-200',
                    isActive(item.href) && [
                      'bg-[#F8FAFC] text-[#2D3748] font-medium',
                      'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#5E72E4]',
                    ],
                    'hover:bg-[#F1F5F9]'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <span>{item.title}</span>
                  )}
                </Link>
              )}

              {/* 子菜单项 */}
              {!isCollapsed &&
                item.items &&
                openMenus.includes(item.href) && (
                  <div className="overflow-hidden transition-[height] duration-300">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          'flex items-center h-[40px] pl-[44px] pr-6 text-[13px] text-[#64748B] opacity-90',
                          'transition-all duration-200',
                          isActive(subItem.href) && [
                            'bg-[#F8FAFC] text-[#2D3748] font-medium',
                          ],
                          'hover:bg-[#F1F5F9]'
                        )}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>

        {/* 折叠按钮 */}
        <div className="p-4 border-t border-[var(--sidebar-border)]">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onCollapse(!isCollapsed)}
            className="w-full h-10 bg-white hover:bg-[#F1F5F9] transition-all duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-[#64748B]" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-[#64748B]" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
} 