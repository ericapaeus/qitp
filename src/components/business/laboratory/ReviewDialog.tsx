'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface ReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  result: {
    id: string
    registrationNo: string
    plantName: string
    symptom: string
    inspector: {
      id: string
      name: string
    }
    method: string
    findings: Array<{
      id: string
      type: string
      description: string
    }>
    conclusion: 'PASS' | 'FAIL' | 'NEED_PROCESS'
  }
  onSubmit: (resultId: string, data: { approved: boolean; comments?: string }) => void
  isSubmitting?: boolean
}

export function ReviewDialog({
  open,
  onOpenChange,
  result,
  onSubmit,
  isSubmitting = false
}: ReviewDialogProps) {
  const [decision, setDecision] = useState<'approve' | 'reject' | ''>('')
  const [comments, setComments] = useState('')

  const handleSubmit = () => {
    if (!decision) return

    onSubmit(result.id, {
      approved: decision === 'approve',
      comments: comments.trim() || undefined
    })
    
    // 重置表单
    setDecision('')
    setComments('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>审核检验结果</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* 任务信息 */}
          <div className="space-y-2">
            <div className="text-sm text-gray-500">检验信息</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">登记号：</span>
                <span>{result.registrationNo}</span>
              </div>
              <div>
                <span className="text-gray-500">植物名称：</span>
                <span>{result.plantName}</span>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">检验员：</span>
              <span>{result.inspector.name}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">检验发现：</span>
              {result.findings.map((finding, index) => (
                <div key={finding.id} className="ml-4">
                  {index + 1}. {finding.type}：{finding.description}
                </div>
              ))}
            </div>
          </div>

          {/* 审核决定 */}
          <div className="space-y-2">
            <Label>审核决定</Label>
            <RadioGroup
              value={decision}
              onValueChange={(value) => setDecision(value as typeof decision)}
            >
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approve" id="approve" />
                  <Label htmlFor="approve">通过</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reject" id="reject" />
                  <Label htmlFor="reject">驳回</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* 审核意见 */}
          <div className="space-y-2">
            <Label htmlFor="comments">审核意见</Label>
            <Textarea
              id="comments"
              placeholder="输入审核意见（选填）"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!decision || isSubmitting}
          >
            {isSubmitting ? '提交中...' : '提交'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 