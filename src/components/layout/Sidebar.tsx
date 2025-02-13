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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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

  // 渲染菜单项
  const renderMenuItem = (item: typeof menuItems[0]) => {
    const active = isActive(item.href) || hasActiveChild(item.items)
    const Icon = item.icon

    const menuButton = (
      <Button
        variant={active ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start",
          "px-3 py-2",
          active && "bg-primary/10 hover:bg-primary/15 dark:bg-primary/20 dark:hover:bg-primary/25",
          "transition-all duration-200 ease-in-out",
          "group",
          "text-left"
        )}
        onClick={() => item.items && toggleMenu(item.href)}
      >
        <Icon className={cn(
          "h-4 w-4 shrink-0",
          active
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
          "transition-colors duration-200"
        )} />
        {!isCollapsed && (
          <>
            <span className={cn(
              "ml-3 flex-1 text-sm truncate",
              active && "font-medium text-primary",
              !active && "group-hover:text-foreground"
            )}>
              {item.title}
            </span>
            {item.items && (
              <ChevronRight
                className={cn(
                  "ml-auto h-4 w-4 shrink-0 mr-2",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  "transition-all duration-200",
                  openMenus.includes(item.href) && "rotate-90"
                )}
              />
            )}
          </>
        )}
      </Button>
    )

    return (
      <div key={item.href} className="relative">
        {isCollapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                {item.items ? menuButton : <Link href={item.href}>{menuButton}</Link>}
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center font-medium">
                {item.title}
                {item.items && (
                  <ChevronRight className="ml-2 h-4 w-4" />
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          item.items ? menuButton : <Link href={item.href}>{menuButton}</Link>
        )}

        {!isCollapsed && item.items && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-200 ease-in-out",
              openMenus.includes(item.href) ? "max-h-96" : "max-h-0"
            )}
          >
            <div className="border-l-2 border-border ml-3 mt-1">
              {item.items.map((subItem) => {
                const subActive = isActive(subItem.href)
                return (
                  <Button
                    key={subItem.href}
                    variant={subActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      "px-4 py-1.5",
                      "text-sm group",
                      subActive && "bg-primary/10 hover:bg-primary/15 dark:bg-primary/20 dark:hover:bg-primary/25",
                      "transition-all duration-200 ease-in-out",
                      "text-left"
                    )}
                    asChild
                  >
                    <Link href={subItem.href}>
                      <span className={cn(
                        "truncate",
                        subActive && "font-medium text-primary",
                        !subActive && "text-muted-foreground group-hover:text-foreground"
                      )}>
                        {subItem.title}
                      </span>
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <aside
      className={cn(
        "fixed top-14 left-0 z-30 h-[calc(100vh-3.5rem)]",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]",
        "border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "flex flex-col"
      )}
    >
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {menuItems.map(renderMenuItem)}
        </div>
      </ScrollArea>
      <div className="h-14 border-t flex items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9",
            "transition-transform duration-200 hover:bg-primary/10",
            isCollapsed && "rotate-180"
          )}
          onClick={() => onCollapse(!isCollapsed)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">
            {isCollapsed ? "展开侧边栏" : "收起侧边栏"}
          </span>
        </Button>
      </div>
    </aside>
  )
} 