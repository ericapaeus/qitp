'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { zhCN } from 'date-fns/locale'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

function DatePickerBase({
  value,
  onChange,
  placeholder = '选择日期',
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP', { locale: zhCN }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          locale={zhCN}
        />
      </PopoverContent>
    </Popover>
  )
}

interface DateRangePickerProps {
  value?: [Date | undefined, Date | undefined]
  onChange?: (dates: [Date | undefined, Date | undefined]) => void
  placeholder?: [string, string]
  className?: string
}

function DateRangePicker({
  value = [undefined, undefined],
  onChange,
  placeholder = ['开始日期', '结束日期'],
  className,
}: DateRangePickerProps) {
  const [startDate, endDate] = value

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DatePickerBase
        value={startDate}
        onChange={(date) => onChange?.([date, endDate])}
        placeholder={placeholder[0]}
        className="w-[200px]"
      />
      <span className="text-muted-foreground">至</span>
      <DatePickerBase
        value={endDate}
        onChange={(date) => onChange?.([startDate, date])}
        placeholder={placeholder[1]}
        className="w-[200px]"
      />
    </div>
  )
}

// 导出组合组件
export const DatePicker = Object.assign(DatePickerBase, { Range: DateRangePicker }) 