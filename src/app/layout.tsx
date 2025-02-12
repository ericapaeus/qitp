import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNavbar from "@/components/layout/TopNavbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "检疫隔离试种信息管理系统",
  description: "管理隔离试种的全流程信息",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* 顶部导航栏 */}
          <TopNavbar />
          
          {/* 主体内容区 */}
          <div className="flex">
            {/* 左侧边栏 */}
            <Sidebar />
            
            {/* 内容区域 */}
            <main className="flex-1 ml-[280px] mt-16 p-6">
              {children}
            </main>
          </div>
          
          {/* 底部导航栏 */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
