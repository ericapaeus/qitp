'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationList } from '@/components/common/NotificationList'

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
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <nav className="flex items-center space-x-6">
            <h1 className="text-xl font-semibold">检疫隔离试种信息管理系统</h1>
          </nav>
          <div className="flex items-center space-x-4">
            <NotificationList />
          </div>
        </div>
      </div>
    </header>
  )
} 