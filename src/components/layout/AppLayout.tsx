import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import { NotificationList } from '@/components/common/NotificationList'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="flex flex-1 items-center justify-between">
              <nav className="flex items-center space-x-6">
                <h1 className="text-xl font-semibold">检疫检测信息平台</h1>
              </nav>
              <div className="flex items-center space-x-4">
                <NotificationList />
              </div>
            </div>
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </div>
    </div>
  )
} 