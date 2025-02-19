'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface AppointmentFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
]

export function AppointmentForm({ onSubmit, onCancel }: AppointmentFormProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>()
  const [formData, setFormData] = useState({
    enterprise: '',
    contact: '',
    phone: '',
    sampleName: '',
    quantity: '',
    sourceCountry: '',
    remarks: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      date: date ? format(date, 'yyyy-MM-dd') : undefined,
      time
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 预约时间 */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>预约日期</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'yyyy-MM-dd') : '选择日期'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={zhCN}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>预约时间</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger>
              <SelectValue placeholder="选择时间" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(slot => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 企业信息 */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>企业名称</Label>
          <Input
            name="enterprise"
            value={formData.enterprise}
            onChange={handleInputChange}
            placeholder="请输入企业名称"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>联系人</Label>
            <Input
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="请输入联系人姓名"
            />
          </div>
          <div className="space-y-2">
            <Label>联系电话</Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="请输入联系电话"
            />
          </div>
        </div>
      </div>

      {/* 样品信息 */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>样品名称</Label>
          <Input
            name="sampleName"
            value={formData.sampleName}
            onChange={handleInputChange}
            placeholder="请输入样品名称"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>数量</Label>
            <Input
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="请输入样品数量"
            />
          </div>
          <div className="space-y-2">
            <Label>来源国</Label>
            <Input
              name="sourceCountry"
              value={formData.sourceCountry}
              onChange={handleInputChange}
              placeholder="请输入来源国"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>备注说明</Label>
          <Input
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            placeholder="请输入备注说明"
          />
        </div>
      </div>

      {/* 按钮组 */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">
          提交预约
        </Button>
      </div>
    </form>
  )
} 