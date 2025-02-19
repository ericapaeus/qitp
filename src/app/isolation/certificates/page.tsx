'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/shared/PageHeader'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileText, Plus, Search, Download, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

type CertificateType = 'PROCESSING_DECISION' | 'QUARANTINE_CERTIFICATE' | 'RELEASE_NOTICE'
type CertificateStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'

interface Certificate {
  id: string
  type: CertificateType
  documentNo: string
  title: string
  status: CertificateStatus
  createdAt: string
  updatedAt: string
  sample: {
    id: string
    name: string
  }
}

const typeConfig: Record<CertificateType, { label: string; color: string }> = {
  PROCESSING_DECISION: {
    label: '处理决定',
    color: 'bg-orange-500'
  },
  QUARANTINE_CERTIFICATE: {
    label: '检疫证书',
    color: 'bg-green-500'
  },
  RELEASE_NOTICE: {
    label: '放行通知',
    color: 'bg-blue-500'
  }
}

const statusConfig: Record<CertificateStatus, { label: string; color: string }> = {
  DRAFT: {
    label: '草稿',
    color: 'bg-gray-500'
  },
  PENDING: {
    label: '待审批',
    color: 'bg-yellow-500'
  },
  APPROVED: {
    label: '已批准',
    color: 'bg-green-500'
  },
  REJECTED: {
    label: '已驳回',
    color: 'bg-red-500'
  }
}

// 模拟数据
const certificates: Certificate[] = [
  {
    id: '1',
    type: 'PROCESSING_DECISION',
    documentNo: 'PD2024030001',
    title: '水稻种子消毒处理决定',
    status: 'APPROVED',
    createdAt: '2024-03-15T10:00:00',
    updatedAt: '2024-03-15T14:30:00',
    sample: {
      id: 'S2024020001',
      name: '水稻种子'
    }
  },
  {
    id: '2',
    type: 'QUARANTINE_CERTIFICATE',
    documentNo: 'QC2024030002',
    title: '玉米种子检疫合格证书',
    status: 'PENDING',
    createdAt: '2024-03-15T11:00:00',
    updatedAt: '2024-03-15T11:00:00',
    sample: {
      id: 'S2024020002',
      name: '玉米种子'
    }
  }
]

export default function CertificatesPage() {
  const [searchText, setSearchText] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | CertificateType>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | CertificateStatus>('all')
  const [showPreview, setShowPreview] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

  // 处理类型选择
  const handleTypeChange = (value: string) => {
    setSelectedType(value as 'all' | CertificateType)
  }

  // 处理状态选择
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as 'all' | CertificateStatus)
  }

  // 过滤文书
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = searchText === '' || 
      cert.documentNo.toLowerCase().includes(searchText.toLowerCase()) ||
      cert.title.toLowerCase().includes(searchText.toLowerCase()) ||
      cert.sample.id.toLowerCase().includes(searchText.toLowerCase()) ||
      cert.sample.name.toLowerCase().includes(searchText.toLowerCase())
    
    const matchesType = selectedType === 'all' || cert.type === selectedType
    const matchesStatus = selectedStatus === 'all' || cert.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="检疫文书"
        description="管理检疫相关文书，包括处理决定、检疫证书和放行通知"
        action={
          <Button onClick={() => {}}>
            <Plus className="h-4 w-4 mr-2" />
            新建文书
          </Button>
        }
      />

      {/* 搜索和筛选 */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="搜索文书..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="文书类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="PROCESSING_DECISION">处理决定</SelectItem>
                <SelectItem value="QUARANTINE_CERTIFICATE">检疫证书</SelectItem>
                <SelectItem value="RELEASE_NOTICE">放行通知</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="DRAFT">草稿</SelectItem>
                <SelectItem value="PENDING">待审批</SelectItem>
                <SelectItem value="APPROVED">已批准</SelectItem>
                <SelectItem value="REJECTED">已驳回</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* 文书列表 */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4 pr-4">
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map(cert => (
              <Card key={cert.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={typeConfig[cert.type].color}>
                        {typeConfig[cert.type].label}
                      </Badge>
                      <Badge variant="secondary" className={statusConfig[cert.status].color}>
                        {statusConfig[cert.status].label}
                      </Badge>
                      <span className="font-medium">{cert.title}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FileText className="h-4 w-4" />
                        <span>文号：{cert.documentNo}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>创建时间：{format(new Date(cert.createdAt), 'yyyy-MM-dd HH:mm')}</span>
                        <span>更新时间：{format(new Date(cert.updatedAt), 'yyyy-MM-dd HH:mm')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span>样品编号：{cert.sample.id}</span>
                      <span>样品名称：{cert.sample.name}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedCertificate(cert)
                        setShowPreview(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      预览
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      下载
                    </Button>
                    {cert.status === 'DRAFT' && (
                      <Button size="sm">继续编辑</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              暂无文书记录
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 预览对话框 */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>文书预览</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="mt-4">
              {/* TODO: 添加文书预览内容 */}
              <div className="text-center text-gray-500 py-8">
                文书预览内容开发中...
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 