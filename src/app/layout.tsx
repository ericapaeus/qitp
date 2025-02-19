'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster';
import { NotificationProvider } from '@/contexts/NotificationContext'
import MainLayout from '@/components/layout/MainLayout'

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient()

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
      </body>
    </html>
  );
}
