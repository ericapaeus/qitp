'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* 顶部导航栏 */}
      <TopNavbar />

      <div className="flex flex-1 overflow-hidden">
        {/* 侧边栏 */}
        <Sidebar />

        {/* 主内容区 */}
        <ScrollArea className="flex-1">
          <main className="min-h-full">
            {/* 面包屑导航 */}
            <div className="px-6 py-4 border-b bg-white">
              <Breadcrumb />
            </div>

            {/* 页面内容 */}
            <div className="p-6">
              {children}
            </div>

            {/* 页脚 */}
            <Footer className="px-6 py-4 border-t bg-white" />
          </main>
        </ScrollArea>
      </div>
    </div>
  )
} 