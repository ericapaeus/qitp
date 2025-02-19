'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster';
import { NotificationProvider } from '@/contexts/NotificationContext'
import MainLayout from '@/components/layout/MainLayout'
import { useEffect } from 'react';

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient()

function MSWComponent() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const initMocks = async () => {
        const { worker } = await import('@/mocks/browser')
        await worker.start({
          onUnhandledRequest: 'bypass'
        })
      }
      initMocks()
    }
  }, [])
  return null
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <MainLayout>{children}</MainLayout>
          </NotificationProvider>
          <Toaster />
        </QueryClientProvider>
        <MSWComponent />
      </body>
    </html>
  );
}
