'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, Printer, Loader2 } from 'lucide-react'
import { InspectionReport } from './report-templates/InspectionReport'
import type { Result } from '@/types/laboratory'
import { useQuery } from '@tanstack/react-query'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

interface ReportPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  result: Result
  onDownload: () => void
  onPrint: () => void
}

export function ReportPreviewDialog({
  open,
  onOpenChange,
  result,
  onDownload,
  onPrint
}: ReportPreviewDialogProps) {
  // 获取报告数据
  const { 
    data: report, 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['laboratory', 'report', result.id],
    queryFn: async () => {
      const response = await fetch(`/api/laboratory/results/${result.id}/report`, {
        method: 'POST'
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '生成报告失败')
      }
      return response.json()
    },
    enabled: open, // 只在对话框打开时获取数据
    retry: 1 // 失败后只重试一次
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>检验报告预览</DialogTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onPrint}
                disabled={isLoading || !!error}
              >
                <Printer className="h-4 w-4 mr-2" />
                打印
              </Button>
              <Button 
                size="sm"
                onClick={onDownload}
                disabled={isLoading || !!error}
              >
                <Download className="h-4 w-4 mr-2" />
                下载
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm">
            {isLoading ? (
              <div className="p-8 flex flex-col items-center justify-center text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <span>正在生成报告...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="mx-8 my-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {error instanceof Error ? error.message : '生成报告失败'}
                </AlertDescription>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="mt-2"
                >
                  重试
                </Button>
              </Alert>
            ) : report ? (
              <InspectionReport report={report} />
            ) : (
              <div className="p-8 text-center text-red-500">
                生成报告失败
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 