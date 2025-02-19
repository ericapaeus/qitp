'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash2, Upload } from 'lucide-react'

// 模拟数据：检验方法列表
const inspectionMethods = [
  { id: 'visual', name: '目视检查' },
  { id: 'microscope', name: '显微镜检查' },
  { id: 'culture', name: '培养检查' },
  { id: 'molecular', name: '分子生物学检测' }
]

interface Finding {
  id: string
  type: string
  description: string
}

interface InspectionFormProps {
  task: {
    id: string
    registrationNo: string
    plantName: string
    symptom: string
  }
  onSubmit: (data: {
    method: string
    findings: Finding[]
    conclusion: 'PASS' | 'FAIL' | 'NEED_PROCESS'
    remarks?: string
    attachments?: File[]
  }) => void
  onSaveDraft?: () => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function InspectionForm({
  task,
  onSubmit,
  onSaveDraft,
  onCancel,
  isSubmitting = false
}: InspectionFormProps) {
  const [method, setMethod] = useState('')
  const [findings, setFindings] = useState<Finding[]>([])
  const [conclusion, setConclusion] = useState<'PASS' | 'FAIL' | 'NEED_PROCESS' | ''>('')
  const [remarks, setRemarks] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])

  // 添加发现
  const addFinding = () => {
    const newFinding: Finding = {
      id: Date.now().toString(),
      type: '',
      description: ''
    }
    setFindings([...findings, newFinding])
  }

  // 更新发现
  const updateFinding = (id: string, field: keyof Finding, value: string) => {
    setFindings(findings.map(finding =>
      finding.id === id ? { ...finding, [field]: value } : finding
    ))
  }

  // 删除发现
  const removeFinding = (id: string) => {
    setFindings(findings.filter(finding => finding.id !== id))
  }

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments([...attachments, ...newFiles])
    }
  }

  // 删除附件
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  // 提交表单
  const handleSubmit = () => {
    if (!method || !conclusion) return

    onSubmit({
      method,
      findings,
      conclusion,
      remarks: remarks.trim() || undefined,
      attachments: attachments.length > 0 ? attachments : undefined
    })
  }

  return (
    <div className="space-y-6">
      {/* 任务信息 */}
      <Card className="p-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">任务信息</div>
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
      </Card>

      {/* 检验方法 */}
      <div className="space-y-2">
        <Label htmlFor="method">检验方法</Label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger id="method">
            <SelectValue placeholder="选择检验方法" />
          </SelectTrigger>
          <SelectContent>
            {inspectionMethods.map(m => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 检验发现 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>检验发现</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFinding}
          >
            <Plus className="h-4 w-4 mr-2" />
            添加发现
          </Button>
        </div>
        
        <ScrollArea className="h-[200px]">
          <div className="space-y-4 pr-4">
            {findings.map((finding, index) => (
              <Card key={finding.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">发现 {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFinding(finding.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>类型</Label>
                      <Input
                        value={finding.type}
                        onChange={(e) => updateFinding(finding.id, 'type', e.target.value)}
                        placeholder="输入发现类型"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>描述</Label>
                      <Textarea
                        value={finding.description}
                        onChange={(e) => updateFinding(finding.id, 'description', e.target.value)}
                        placeholder="输入详细描述"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 检验结论 */}
      <div className="space-y-2">
        <Label>检验结论</Label>
        <RadioGroup
          value={conclusion}
          onValueChange={(value) => setConclusion(value as typeof conclusion)}
        >
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PASS" id="pass" />
              <Label htmlFor="pass">合格</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="FAIL" id="fail" />
              <Label htmlFor="fail">不合格</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="NEED_PROCESS" id="need-process" />
              <Label htmlFor="need-process">需要处理</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* 备注说明 */}
      <div className="space-y-2">
        <Label htmlFor="remarks">备注说明</Label>
        <Textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="输入备注说明（选填）"
        />
      </div>

      {/* 附件上传 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>附件</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            上传附件
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        
        {attachments.length > 0 && (
          <ScrollArea className="h-[100px]">
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <span className="text-sm">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        {onSaveDraft && (
          <Button 
            variant="outline" 
            onClick={onSaveDraft}
            disabled={isSubmitting}
          >
            保存草稿
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!method || !conclusion || isSubmitting}
        >
          {isSubmitting ? '提交中...' : '提交'}
        </Button>
      </div>
    </div>
  )
} 