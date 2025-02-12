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

export default function TopNavbar() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  // 生成面包屑导航
  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: `/${segment}`,
    }))

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* 左侧系统名称 */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            检疫隔离试种信息管理系统
          </Link>
        </div>

        {/* 中间面包屑导航 */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            首页
          </Link>
          {breadcrumbs.map((item, index) => (
            <div key={item.href} className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <Link
                href={item.href}
                className="text-gray-600 hover:text-gray-900"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>

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