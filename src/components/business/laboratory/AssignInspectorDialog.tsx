'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

// 模拟数据：检验人员列表
const inspectors = [
  { id: '1', name: '张三', title: '高级检验员' },
  { id: '2', name: '李四', title: '检验员' },
  { id: '3', name: '王五', title: '检验员' }
]

interface AssignInspectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: {
    id: string
    registrationNo: string
    plantName: string
    symptom: string
  }
  onAssign: (taskId: string, data: { inspectorId: string; remarks?: string }) => void
  isSubmitting?: boolean
}

export function AssignInspectorDialog({
  open,
  onOpenChange,
  task,
  onAssign,
  isSubmitting = false
}: AssignInspectorDialogProps) {
  const [selectedInspector, setSelectedInspector] = useState<string>('')
  const [remarks, setRemarks] = useState('')

  const handleSubmit = () => {
    if (!selectedInspector) return

    onAssign(task.id, {
      inspectorId: selectedInspector,
      remarks: remarks.trim() || undefined
    })
    
    // 重置表单
    setSelectedInspector('')
    setRemarks('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>分配检验任务</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* 任务信息 */}
          <div className="space-y-2">
            <div className="text-sm text-gray-500">任务信息</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">登记号：</span>
                <span>{task.registrationNo}</span>
              </div>
              <div>
                <span className="text-gray-500">植物名称：</span>
                <span>{task.plantName}</span>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">可疑症状：</span>
              <span>{task.symptom}</span>
            </div>
          </div>

          {/* 检验员选择 */}
          <div className="space-y-2">
            <Label htmlFor="inspector">检验员</Label>
            <Select
              value={selectedInspector}
              onValueChange={setSelectedInspector}
            >
              <SelectTrigger id="inspector">
                <SelectValue placeholder="选择检验员" />
              </SelectTrigger>
              <SelectContent>
                {inspectors.map(inspector => (
                  <SelectItem key={inspector.id} value={inspector.id}>
                    {inspector.name} ({inspector.title})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 备注说明 */}
          <div className="space-y-2">
            <Label htmlFor="remarks">备注说明</Label>
            <Textarea
              id="remarks"
              placeholder="输入备注说明（选填）"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedInspector || isSubmitting}
          >
            {isSubmitting ? '分配中...' : '确认分配'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 