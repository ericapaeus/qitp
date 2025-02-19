'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Clock, AlertTriangle, FileText, Download, CheckCircle2, XCircle, HelpCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ReviewDialog } from '@/components/business/laboratory/ReviewDialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ReportPreviewDialog } from '@/components/business/laboratory/ReportPreviewDialog'
import { generatePDF } from '@/lib/reports/generatePDF'
import { downloadFile } from '@/lib/reports/downloadFile'
import { toast } from '@/components/ui/use-toast'
import { LoadingState } from '@/components/ui/loading-state'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Result, ConclusionType, ReviewStatusType, InspectionMethod } from '@/types/laboratory'

const methodMap: Record<InspectionMethod, string> = {
  visual: '目视检查',
  microscope: '显微镜检查',
  culture: '培养检查',
  molecular: '分子生物学检测'
}

const conclusionMap: Record<ConclusionType, { label: string; color: string }> = {
  PASS: { label: '合格', color: 'bg-green-500' },
  FAIL: { label: '不合格', color: 'bg-red-500' },
  NEED_PROCESS: { label: '需要处理', color: 'bg-yellow-500' }
}

const reviewStatusMap: Record<ReviewStatusType, { label: string; color: string }> = {
  PENDING: { label: '待审核', color: 'bg-yellow-500' },
  APPROVED: { label: '已通过', color: 'bg-green-500' },
  REJECTED: { label: '已驳回', color: 'bg-red-500' }
}

export default function ResultsPage() {
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | ReviewStatusType>('all')
  const [selectedConclusion, setSelectedConclusion] = useState<'all' | ConclusionType>('all')
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedResult, setSelectedResult] = useState<Result | null>(null)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  
  // 获取结果列表
  const { 
    data: results = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['laboratory', 'results', { status: selectedStatus, conclusion: selectedConclusion }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      if (selectedConclusion !== 'all') params.append('conclusion', selectedConclusion)
      
      const response = await fetch(`/api/laboratory/results?${params.toString()}`)
      if (!response.ok) {
        throw new Error('获取检验结果失败')
      }
      return response.json()
    }
  })

  // 审核结果
  const { mutate: reviewResult, isPending: isReviewing } = useMutation({
    mutationFn: async ({ 
      resultId, 
      data 
    }: { 
      resultId: string
      data: { approved: boolean; comments?: string }
    }) => {
      const response = await fetch(`/api/laboratory/results/${resultId}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '审核结果失败')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laboratory', 'results'] })
      toast({
        title: '审核成功',
        description: '检验结果已完成审核'
      })
      setReviewDialogOpen(false)
      setSelectedResult(null)
    },
    onError: (error) => {
      toast({
        title: '审核失败',
        description: error instanceof Error ? error.message : '操作过程中发生错误',
        variant: 'destructive'
      })
    }
  })

  // 处理审核提交
  const handleReviewSubmit = (resultId: string, data: { approved: boolean; comments?: string }) => {
    reviewResult({ resultId, data })
  }

  // 处理报告生成
  const handleGenerateReport = async (resultId: string) => {
    const result = results.find((r: Result) => r.id === resultId)
    if (!result) {
      toast({
        title: '生成报告失败',
        description: '未找到检验结果',
        variant: 'destructive'
      })
      return
    }

    if (result.reviewStatus !== 'APPROVED') {
      toast({
        title: '生成报告失败',
        description: '只能为已审核通过的结果生成报告',
        variant: 'destructive'
      })
      return
    }

    setSelectedResult(result)
    setReportDialogOpen(true)
  }

  // 处理报告下载
  const handleDownloadReport = async () => {
    if (!reportRef.current || !selectedResult) return

    try {
      const filename = `检验报告_${selectedResult.registrationNo}.pdf`
      const success = await generatePDF(reportRef.current, filename)

      if (success) {
        toast({
          title: '下载成功',
          description: `报告已保存为：${filename}`,
        })
        setReportDialogOpen(false)
      } else {
        throw new Error('生成PDF失败')
      }
    } catch (error) {
      toast({
        title: '下载失败',
        description: '生成报告时出现错误，请重试',
        variant: 'destructive'
      })
    }
  }

  // 处理报告打印
  const handlePrintReport = () => {
    if (!selectedResult) return
    window.print()
  }

  // 过滤结果
  const filteredResults = results.filter((result: Result) => {
    const matchesSearch = searchText === '' || 
      result.registrationNo.toLowerCase().includes(searchText.toLowerCase()) ||
      result.plantName.toLowerCase().includes(searchText.toLowerCase()) ||
      result.inspector.name.toLowerCase().includes(searchText.toLowerCase()) ||
      result.symptom.toLowerCase().includes(searchText.toLowerCase())
    
    return matchesSearch
  })

  // 清理选中状态
  useEffect(() => {
    return () => {
      setSelectedResult(null)
      setReviewDialogOpen(false)
      setReportDialogOpen(false)
    }
  }, [])

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : '加载数据时发生错误'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="检验结果管理"
        description="审核检验结果，生成检验报告"
      />

      {/* 操作提示 */}
      <Alert>
        <HelpCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div>检验结果审核流程：</div>
            <ul className="list-decimal list-inside space-y-1">
              <li>查看检验结果详情，包括检验方法、发现和结论</li>
              <li>审核结果：选择"通过"或"驳回"，并填写审核意见</li>
              <li>审核通过后，可以生成检验报告</li>
            </ul>
            <div className="text-sm text-muted-foreground mt-2">
              提示：
              <ul className="list-disc list-inside mt-1">
                <li>审核通过后的结果不能再次修改</li>
                <li>生成报告前请仔细检查所有信息</li>
                <li>可以通过筛选和搜索快速定位结果</li>
              </ul>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* 搜索和筛选 */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="搜索结果..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Select 
              value={selectedStatus} 
              onValueChange={(value: typeof selectedStatus) => setSelectedStatus(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="审核状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="PENDING">待审核</SelectItem>
                <SelectItem value="APPROVED">已通过</SelectItem>
                <SelectItem value="REJECTED">已驳回</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={selectedConclusion}
              onValueChange={(value: typeof selectedConclusion) => setSelectedConclusion(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="检验结论" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部结论</SelectItem>
                <SelectItem value="PASS">合格</SelectItem>
                <SelectItem value="FAIL">不合格</SelectItem>
                <SelectItem value="NEED_PROCESS">需要处理</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* 结果列表 */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4 pr-4">
          {isLoading ? (
            <LoadingState text="正在加载检验结果..." />
          ) : filteredResults.length > 0 ? (
            filteredResults.map((result: Result) => (
              <Card key={result.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={conclusionMap[result.conclusion].color + ' text-white'}
                      >
                        {conclusionMap[result.conclusion].label}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={reviewStatusMap[result.reviewStatus].color + ' text-white'}
                      >
                        {reviewStatusMap[result.reviewStatus].label}
                      </Badge>
                      <span className="font-medium">
                        登记号：{result.registrationNo}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <AlertTriangle className="h-4 w-4" />
                        <span>可疑症状：{result.symptom}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>
                          检验时间：
                          {format(new Date(result.inspectionDate), 'yyyy-MM-dd HH:mm')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>植物名称：{result.plantName}</span>
                        <span>检验员：{result.inspector.name}</span>
                        <span>检验方法：{methodMap[result.method as keyof typeof methodMap]}</span>
                      </div>
                      {result.findings.length > 0 && (
                        <div className="text-sm text-gray-500">
                          <span>检验发现：</span>
                          {result.findings.map((finding, index) => (
                            <div key={finding.id} className="ml-4">
                              {index + 1}. {finding.type}：{finding.description}
                            </div>
                          ))}
                        </div>
                      )}
                      {result.reviewer && (
                        <div className="text-sm text-gray-500">
                          <span>审核意见：</span>
                          <span>{result.reviewer.comments}</span>
                          <span className="ml-2">（{result.reviewer.name}）</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {result.reviewStatus === 'PENDING' && (
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedResult(result)
                          setReviewDialogOpen(true)
                        }}
                      >
                        审核
                      </Button>
                    )}
                    {result.reviewStatus === 'APPROVED' && (
                      <Button 
                        size="sm"
                        onClick={() => handleGenerateReport(result.id)}
                      >
                        生成报告
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      查看详情
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 py-12">
              暂无检验结果
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 审核对话框 */}
      {selectedResult && (
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          result={selectedResult}
          onSubmit={handleReviewSubmit}
          isSubmitting={isReviewing}
        />
      )}

      {/* 报告预览对话框 */}
      {selectedResult && (
        <ReportPreviewDialog
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          result={selectedResult}
          onDownload={handleDownloadReport}
          onPrint={handlePrintReport}
        />
      )}
    </div>
  )
} 