import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { ChevronDown, ChevronUp, Search, RotateCcw } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import type { SearchFormProps } from './types'
import type { SearchField } from '@/types/common'

/**
 * 搜索表单组件
 */
export function SearchForm({
  fields,
  initialValues = {},
  onSubmit,
  onReset,
  showReset = true,
  collapsible = false,
  defaultCollapsed = true,
  columns = 3,
  className,
  loading = false,
}: SearchFormProps) {
  // 表单值
  const [values, setValues] = useState<Record<string, any>>(initialValues)
  // 展开状态
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  // 处理字段值变化
  const handleFieldChange = useCallback((name: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  // 处理提交
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(values)
    },
    [values, onSubmit]
  )

  // 处理重置
  const handleReset = useCallback(() => {
    setValues(initialValues)
    onReset?.()
  }, [initialValues, onReset])

  // 渲染搜索字段
  const renderField = useCallback((field: SearchField) => {
    const { type, name, label, placeholder, options } = field
    const value = values[name]

    switch (type) {
      case 'select':
        return (
          <Select value={value} onValueChange={(value) => handleFieldChange(name, value)}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'date':
        return (
          <DatePicker
            key={name}
            value={value}
            onChange={(value) => handleFieldChange(name, value)}
            placeholder={placeholder}
          />
        )
      case 'dateRange':
        return (
          <DatePicker.Range
            key={name}
            value={value as [Date | undefined, Date | undefined]}
            onChange={(value) => handleFieldChange(name, value)}
            placeholder={placeholder ? [placeholder, placeholder] : undefined}
          />
        )
      default:
        return (
          <Input
            key={name}
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(name, e.target.value)}
            placeholder={placeholder}
          />
        )
    }
  }, [values, handleFieldChange])

  // 计算显示的字段
  const visibleFields = collapsed ? fields.slice(0, columns) : fields

  return (
    <form onSubmit={handleSubmit}>
      <Card className={cn('shadow-none', className)}>
        <CardContent className="pt-6">
          <div
            className={cn('grid gap-6', {
              'grid-cols-1': columns === 1,
              'grid-cols-2': columns === 2,
              'grid-cols-3': columns === 3,
              'grid-cols-4': columns === 4,
            })}
          >
            {visibleFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-6 py-4 border-t">
          <div className="flex items-center space-x-2">
            <Button type="submit" disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              搜索
            </Button>
            {showReset && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={loading}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                重置
              </Button>
            )}
          </div>

          {collapsible && fields.length > columns && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <>
                  展开
                  <ChevronDown className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  收起
                  <ChevronUp className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}

export default SearchForm 