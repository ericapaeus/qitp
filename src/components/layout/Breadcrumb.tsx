'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

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

export default function Breadcrumb() {
  const pathname = usePathname()

  // 生成面包屑导航
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs = []
    
    let currentPath = ''
    for (const path of paths) {
      currentPath += `/${path}`
      
      // 查找主菜单项
      const menuItem = menuItems.find(item => item.href === currentPath)
      if (menuItem) {
        breadcrumbs.push({
          title: menuItem.title,
          href: menuItem.href,
        })
        continue
      }
      
      // 查找子菜单项
      const parentMenu = menuItems.find(item => 
        item.items?.some(subItem => subItem.href === currentPath)
      )
      if (parentMenu) {
        const subItem = parentMenu.items?.find(item => item.href === currentPath)
        if (subItem) {
          breadcrumbs.push({
            title: subItem.title,
            href: subItem.href,
          })
        }
      }
    }
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav className="h-14 px-6 flex items-center bg-white border-b border-[var(--sidebar-border)]">
      <Link 
        href="/" 
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        首页
      </Link>
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          <Link
            href={item.href}
            className={cn(
              'text-sm transition-colors',
              pathname === item.href
                ? 'text-gray-900 font-medium'
                : 'text-gray-500 hover:text-gray-900'
            )}
          >
            {item.title}
          </Link>
        </div>
      ))}
    </nav>
  )
} 