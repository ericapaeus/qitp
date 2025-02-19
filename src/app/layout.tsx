'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { Toaster } from '@/components/ui/toaster';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { useEffect } from 'react';

const inter = Inter({ subsets: ["latin"] });

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
        <QueryProvider>
          <MSWComponent />
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
