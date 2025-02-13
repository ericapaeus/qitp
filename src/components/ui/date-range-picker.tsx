'use client';

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { zhCN } from 'date-fns/locale'

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (value: DateRange | undefined) => void
  placeholder?: string
  className?: string
  showShortcuts?: boolean
  disabled?: boolean
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "选择日期范围",
  className,
  showShortcuts = true,
  disabled = false,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setDate(value)
  }, [value])

  const shortcuts = React.useMemo(() => [
    {
      label: '今天',
      getValue: () => ({
        from: startOfDay(new Date()),
        to: endOfDay(new Date())
      })
    },
    {
      label: '昨天',
      getValue: () => ({
        from: startOfDay(addDays(new Date(), -1)),
        to: endOfDay(addDays(new Date(), -1))
      })
    },
    {
      label: '本周',
      getValue: () => ({
        from: startOfWeek(new Date(), { weekStartsOn: 1 }),
        to: endOfWeek(new Date(), { weekStartsOn: 1 })
      })
    },
    {
      label: '上周',
      getValue: () => ({
        from: startOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }),
        to: endOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 })
      })
    },
    {
      label: '本月',
      getValue: () => ({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date())
      })
    },
    {
      label: '上月',
      getValue: () => {
        const start = startOfMonth(addDays(new Date(), -30))
        return {
          from: start,
          to: endOfMonth(start)
        }
      }
    },
    {
      label: '最近7天',
      getValue: () => ({
        from: addDays(new Date(), -6),
        to: new Date()
      })
    },
    {
      label: '最近30天',
      getValue: () => ({
        from: addDays(new Date(), -29),
        to: new Date()
      })
    }
  ], [])

  const handleSelect = React.useCallback((value: DateRange | undefined) => {
    setDate(value)
    onChange?.(value)
    if (value?.from && value?.to) {
      setOpen(false)
    }
  }, [onChange])

  const handleShortcutClick = React.useCallback((getValue: () => DateRange) => {
    const range = getValue()
    setDate(range)
    onChange?.(range)
    setOpen(false)
  }, [onChange])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "yyyy-MM-dd")} ~{" "}
                  {format(date.to, "yyyy-MM-dd")}
                </>
              ) : (
                format(date.from, "yyyy-MM-dd")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={2}
              locale={zhCN}
            />
            {showShortcuts && (
              <div className="border-l border-border p-2 space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => handleShortcutClick(shortcut.getValue)}
                  >
                    {shortcut.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 