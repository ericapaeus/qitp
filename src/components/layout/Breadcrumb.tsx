'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { menuItems } from '@/config/menu'

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
  
  if (breadcrumbs.length === 0) return null

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500">
      <Link href="/" className="hover:text-gray-700">
        首页
      </Link>
      {breadcrumbs.map((item) => (
        <div key={item.href} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          <Link
            href={item.href}
            className="hover:text-gray-700"
          >
            {item.title}
          </Link>
        </div>
      ))}
    </nav>
  )
} 