'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useEnvironmentData } from '@/hooks/isolation/useEnvironmentData'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, ArrowDown, ArrowUp, History, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { EnvironmentHistory } from './EnvironmentHistory'

export function EnvironmentMonitor() {
  const [activeMetric, setActiveMetric] = useState('temperature')
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const { data, latestData, isLoading, error } = useEnvironmentData()

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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          加载环境数据失败：{error.message}
        </AlertDescription>
      </Alert>
    )
  }

  const isMetricWarning = (value: number, metric: string) => {
    const config = getMetricConfig(metric)
    return value < config.warning.min || value > config.warning.max
  }

  // 计算趋势
  const getTrend = (current: number, previous: number): { direction: 'up' | 'down'; value: string } => {
    const diff = current - previous
    return {
      direction: diff >= 0 ? 'up' : 'down' as const,
      value: Math.abs(diff).toFixed(1)
    }
  }

  const renderChart = (height: number = 300) => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="time" 
          tickFormatter={(time) => format(new Date(`2024-01-01T${time}`), 'HH:mm')}
        />
        <YAxis 
          domain={config.domain}
          tickFormatter={(value) => `${value}${config.unit}`}
        />
        <Tooltip 
          formatter={(value: number) => `${value.toFixed(1)}${config.unit}`}
          labelFormatter={(label: string) => `时间：${label}`}
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
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs value={activeMetric} onValueChange={setActiveMetric}>
          <TabsList>
            <TabsTrigger value="temperature">温度</TabsTrigger>
            <TabsTrigger value="humidity">湿度</TabsTrigger>
            <TabsTrigger value="light">光照</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFullscreen(true)}
          >
            <Maximize2 className="h-4 w-4 mr-1" />
            全屏查看
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(true)}
          >
            <History className="h-4 w-4 mr-1" />
            历史数据
          </Button>
        </div>
      </div>

      <div className="h-[300px]">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          renderChart()
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : latestData && data.length > 0 ? (
          <>
            <MetricCard
              label="当前温度"
              value={latestData.temperature.toFixed(1)}
              unit="°C"
              status={isMetricWarning(latestData.temperature, 'temperature') ? 'warning' : 'normal'}
              trend={getTrend(latestData.temperature, data[data.length - 2].temperature)}
            />
            <MetricCard
              label="当前湿度"
              value={latestData.humidity.toFixed(1)}
              unit="%"
              status={isMetricWarning(latestData.humidity, 'humidity') ? 'warning' : 'normal'}
              trend={getTrend(latestData.humidity, data[data.length - 2].humidity)}
            />
            <MetricCard
              label="当前光照"
              value={latestData.light.toFixed(0)}
              unit="lux"
              status={isMetricWarning(latestData.light, 'light') ? 'warning' : 'normal'}
              trend={getTrend(latestData.light, data[data.length - 2].light)}
            />
          </>
        ) : null}
      </div>

      {/* 全屏图表 */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              {config.label}趋势图
            </DialogTitle>
          </DialogHeader>
          <div className="h-[600px] mt-4">
            {renderChart(600)}
          </div>
        </DialogContent>
      </Dialog>

      {/* 历史数据对话框 */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>历史数据查看</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <EnvironmentHistory />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MetricCard({
  label,
  value,
  unit,
  status = 'normal',
  trend
}: {
  label: string
  value: string
  unit: string
  status?: 'normal' | 'warning'
  trend?: {
    direction: 'up' | 'down'
    value: string
  }
}) {
  return (
    <Card className="p-4">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{label}</span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className={`text-2xl font-semibold ${
            status === 'warning' ? 'text-red-500' : ''
          }`}>
            {value}
          </span>
          <span className="text-sm text-gray-500">{unit}</span>
          {trend && (
            <div className={`flex items-center text-sm ${
              trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              {trend.direction === 'up' ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              {trend.value}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
} 