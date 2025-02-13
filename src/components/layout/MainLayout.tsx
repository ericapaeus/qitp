'use client'

import { useState } from 'react'
import TopNavbar from './TopNavbar'
import Sidebar from './Sidebar'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <TooltipProvider>
        <TopNavbar />
        <div className="flex">
          <Sidebar isCollapsed={isCollapsed} onCollapse={setIsCollapsed} />
          <div 
            className={cn(
              "flex-1 flex flex-col transition-[margin] duration-300 ease-in-out",
              isCollapsed 
                ? "lg:ml-[var(--sidebar-width-collapsed)]" 
                : "lg:ml-[var(--sidebar-width)]"
            )}
          >
            <div className="flex-1 flex flex-col pt-2">
              <div className="px-4 sm:px-6 mb-4">
                <Breadcrumb />
              </div>
              <main className="flex-1 px-4 sm:px-6 mx-auto w-full max-w-7xl">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  {children}
                </div>
              </main>
              <Footer className="mt-6" />
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  )
} 