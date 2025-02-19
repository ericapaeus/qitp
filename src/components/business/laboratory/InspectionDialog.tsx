'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InspectionForm } from './InspectionForm'

interface InspectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: {
    id: string
    registrationNo: string
    plantName: string
    symptom: string
  }
  onSubmit: (data: {
    method: string
    findings: Array<{
      id: string
      type: string
      description: string
    }>
    conclusion: 'PASS' | 'FAIL' | 'NEED_PROCESS'
    remarks?: string
    attachments?: File[]
  }) => void
  isSubmitting?: boolean
}

export function InspectionDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
  isSubmitting = false
}: InspectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>检验记录</DialogTitle>
        </DialogHeader>
        <InspectionForm
          task={task}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
} 