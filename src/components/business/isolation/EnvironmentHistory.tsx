'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Button } from '@/components/ui/button'
import { Download, Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format, subDays } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'

interface HistoryData {
  timestamp: string
  temperature: number
  humidity: number
  light: number
}

// 模拟数据生成
function generateHistoryData(startDate: Date, endDate: Date): HistoryData[] {
  const data: HistoryData[] = []
  let currentDate = startDate
  while (currentDate <= endDate) {
    data.push({
      timestamp: currentDate.toISOString(),
      temperature: 20 + Math.random() * 5,
      humidity: 60 + Math.random() * 20,
      light: 800 + Math.random() * 400,
    })
    currentDate = new Date(currentDate.getTime() + 30 * 60 * 1000) // 30分钟间隔
  }
  return data
}

export function EnvironmentHistory() {
  const [activeMetric, setActiveMetric] = useState('temperature')
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date()
  })
  const [interval, setInterval] = useState('30min')

  // 处理日期范围变化
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range)
    }
  }

  // 模拟数据
  const data = generateHistoryData(
    dateRange.from ?? subDays(new Date(), 7),
    dateRange.to ?? new Date()
  )

  const getMetricConfig = (metric: string) => {
    switch (metric) {
      case 'temperature':
        return {
          label: '温度',
          unit: '°C',
          color: '#ef4444',
          domain: [15, 30],
          warning: {
            min: 18,
            max: 25
          }
        }
      case 'humidity':
        return {
          label: '湿度',
          unit: '%',
          color: '#3b82f6',
          domain: [40, 90],
          warning: {
            min: 50,
            max: 80
          }
        }
      case 'light':
        return {
          label: '光照',
          unit: 'lux',
          color: '#eab308',
          domain: [0, 2000],
          warning: {
            min: 500,
            max: 1500
          }
        }
      default:
        return {
          label: '',
          unit: '',
          color: '#000000',
          domain: [0, 100],
          warning: {
            min: 0,
            max: 100
          }
        }
    }
  }

  const config = getMetricConfig(activeMetric)

  // 计算统计数据
  const stats = data.reduce((acc, item) => {
    const value = item[activeMetric as keyof typeof item] as number
    return {
      min: Math.min(acc.min, value),
      max: Math.max(acc.max, value),
      sum: acc.sum + value,
      count: acc.count + 1
    }
  }, { min: Infinity, max: -Infinity, sum: 0, count: 0 })

  const average = stats.sum / stats.count

  // 导出数据
  const exportData = () => {
    const csvContent = [
      ['时间', '温度(°C)', '湿度(%)', '光照(lux)'].join(','),
      ...data.map(item => [
        format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        item.temperature.toFixed(1),
        item.humidity.toFixed(1),
        item.light.toFixed(0)
      ].join(','))
    ].join('\\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `环境数据_${format(dateRange.from ?? new Date(), 'yyyyMMdd')}_${format(dateRange.to ?? new Date(), 'yyyyMMdd')}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs value={activeMetric} onValueChange={setActiveMetric}>
          <TabsList>
            <TabsTrigger value="temperature">温度</TabsTrigger>
            <TabsTrigger value="humidity">湿度</TabsTrigger>
            <TabsTrigger value="light">光照</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap gap-4 items-center">
          <DateRangePicker
            value={dateRange}
            onValueChange={handleDateRangeChange}
          />
          <Select value={interval} onValueChange={setInterval}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="采样间隔" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30min">30分钟</SelectItem>
              <SelectItem value="1h">1小时</SelectItem>
              <SelectItem value="2h">2小时</SelectItem>
              <SelectItem value="6h">6小时</SelectItem>
              <SelectItem value="12h">12小时</SelectItem>
              <SelectItem value="1d">1天</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            导出数据
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">最大值</span>
            <span className="text-2xl font-semibold mt-1">
              {stats.max.toFixed(1)}{config.unit}
            </span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">最小值</span>
            <span className="text-2xl font-semibold mt-1">
              {stats.min.toFixed(1)}{config.unit}
            </span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">平均值</span>
            <span className="text-2xl font-semibold mt-1">
              {average.toFixed(1)}{config.unit}
            </span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">数据点数</span>
            <span className="text-2xl font-semibold mt-1">
              {stats.count}
            </span>
          </div>
        </Card>
      </div>

      {/* 图表 */}
      <Card className="p-6">
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(timestamp) => format(new Date(timestamp), 'MM-dd HH:mm')}
              />
              <YAxis 
                domain={config.domain}
                tickFormatter={(value) => `${value}${config.unit}`}
              />
              <Tooltip 
                formatter={(value: number) => `${value.toFixed(1)}${config.unit}`}
                labelFormatter={(timestamp: string) => format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss')}
              />
              <ReferenceLine 
                y={config.warning.max} 
                stroke="red" 
                strokeDasharray="3 3"
                label={{ value: '上限', position: 'right' }}
              />
              <ReferenceLine 
                y={config.warning.min} 
                stroke="red" 
                strokeDasharray="3 3"
                label={{ value: '下限', position: 'right' }}
              />
              <Line
                type="monotone"
                dataKey={activeMetric}
                stroke={config.color}
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
} 