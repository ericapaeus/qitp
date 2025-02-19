import { type LucideIcon, LayoutDashboard, Building, Building2, TestTubes, Sprout, FileText, BarChart3, Settings } from 'lucide-react'

export interface MenuItem {
  title: string
  icon: LucideIcon
  href: string
  items?: {
    title: string
    href: string
  }[]
}

export const menuItems: MenuItem[] = [
  {
    title: '工作台',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    title: '引种企业',
    icon: Building,
    href: '/enterprises',
    items: [
      { title: '企业管理', href: '/enterprises' },
      { title: '引种记录', href: '/enterprises/imports' },
    ],
  },
  {
    title: '检疫机构',
    icon: Building2,
    href: '/quarantine-organizations',
    items: [
      { title: '机构管理', href: '/quarantine-organizations' },
      { title: '人员管理', href: '/quarantine-organizations/staff' },
    ],
  },
  {
    title: '隔离试种',
    icon: Sprout,
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