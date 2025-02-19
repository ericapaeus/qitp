import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Search, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchField {
  label: string
  name: string
  type: 'text' | 'select' | 'dateRange'
  placeholder?: string
  options?: { label: string; value: string }[]
  required?: boolean
  defaultValue?: any
}

interface SearchFormProps {
  fields: SearchField[]
  onSearch: (values: Record<string, any>) => void
  onReset?: () => void
  loading?: boolean
  showReset?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function SearchForm({
  fields,
  onSearch,
  onReset,
  loading = false,
  showReset = true,
  collapsible = false,
  defaultCollapsed = true,
  columns = 3,
  className,
}: SearchFormProps) {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const defaultValues: Record<string, any> = {}
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        defaultValues[field.name] = field.defaultValue
      } else if (field.type === 'select' && !field.required) {
        defaultValues[field.name] = '$all'
      }
    })
    return defaultValues
  })
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const handleInputChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 过滤掉值为 null 或 '$all' 的字段
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value != null && value !== '$all')
    )
    onSearch(filteredValues)
  }

  const handleReset = () => {
    const defaultValues: Record<string, any> = {}
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        defaultValues[field.name] = field.defaultValue
      } else if (field.type === 'select' && !field.required) {
        defaultValues[field.name] = '$all'
      }
    })
    setValues(defaultValues)
    onReset?.()
    onSearch(defaultValues)
  }

  // 计算显示的字段
  const visibleFields = collapsed ? fields.slice(0, columns) : fields

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div
        className={cn("grid gap-4", {
          'grid-cols-1': columns === 1,
          'grid-cols-2': columns === 2,
          'grid-cols-3': columns === 3,
          'grid-cols-4': columns === 4,
        })}
      >
        {visibleFields.map(field => (
          <div key={field.name} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === 'text' && (
              <Input
                value={values[field.name] || ''}
                onChange={e => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
            {field.type === 'select' && field.options && (
              <Select
                value={values[field.name]}
                onValueChange={value => handleInputChange(field.name, value)}
                required={field.required}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {!field.required && (
                    <SelectItem value="$all">全部</SelectItem>
                  )}
                  {field.options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {field.type === 'dateRange' && (
              <DateRangePicker
                value={values[field.name]}
                onValueChange={value => handleInputChange(field.name, value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        {collapsible && fields.length > columns && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sm"
          >
            {collapsed ? (
              <>
                展开
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                收起
                <ChevronUp className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
        <div className={cn("flex space-x-2", collapsible ? "ml-auto" : "")}>
          {showReset && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              重置
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            <Search className="mr-2 h-4 w-4" />
            搜索
          </Button>
        </div>
      </div>
    </form>
  )
} 