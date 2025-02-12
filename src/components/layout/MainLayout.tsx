'use client'

import { useState } from 'react'
import TopNavbar from './TopNavbar'
import Sidebar from './Sidebar'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <TopNavbar />
      <Sidebar isCollapsed={isCollapsed} onCollapse={setIsCollapsed} />
      <div 
        className="flex-1 flex flex-col pt-16 transition-[margin] duration-300"
        style={{ 
          marginLeft: isCollapsed 
            ? 'var(--sidebar-width-collapsed)' 
            : 'var(--sidebar-width)' 
        }}
      >
        <Breadcrumb />
        <main className="flex-1 p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
} 