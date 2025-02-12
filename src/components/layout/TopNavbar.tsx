'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// 从 Sidebar 导入菜单配置
const menuItems = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '企业管理',
    href: '/enterprises',
    items: [
      { title: '企业信息', href: '/enterprises' },
      { title: '引种记录', href: '/enterprises/imports' },
    ],
  },
  {
    title: '检疫机构',
    href: '/quarantine',
    items: [
      { title: '机构信息', href: '/quarantine/organizations' },
      { title: '检疫人员', href: '/quarantine/staff' },
    ],
  },
  {
    title: '隔离试种',
    href: '/isolation',
    items: [
      { title: '样品接收', href: '/isolation/samples' },
      { title: '试种管理', href: '/isolation/plants' },
      { title: '检疫处理', href: '/isolation/quarantine' },
    ],
  },
  {
    title: '实验室检验',
    href: '/laboratory',
    items: [
      { title: '检验任务', href: '/laboratory/tasks' },
      { title: '检验结果', href: '/laboratory/results' },
    ],
  },
  {
    title: '表单管理',
    href: '/forms',
    items: [
      { title: '表单模板', href: '/forms/templates' },
      { title: '表单记录', href: '/forms/records' },
    ],
  },
  {
    title: '数据分析',
    href: '/analysis',
    items: [
      { title: '统计报表', href: '/analysis/statistics' },
      { title: '数据导出', href: '/analysis/export' },
    ],
  },
  {
    title: '系统设置',
    href: '/settings',
    items: [
      { title: '用户管理', href: '/settings/users' },
      { title: '角色权限', href: '/settings/roles' },
      { title: '基础数据', href: '/settings/base-data' },
    ],
  },
]

export default function TopNavbar() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 bg-white z-50"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* 左侧系统名称 */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            检疫隔离试种信息管理系统
          </Link>
        </div>

        {/* 右侧工具栏 */}
        <div className="flex items-center gap-4">
          {/* 搜索框 */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* 通知按钮 */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          {/* 用户菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>我的账号</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>个人信息</DropdownMenuItem>
              <DropdownMenuItem>系统设置</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
} 