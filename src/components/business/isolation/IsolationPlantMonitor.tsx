'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Thermometer, Droplets, Sun, Wind, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnvironmentData {
  temperature: number;
  humidity: number;
  light: number;
  airflow: number;
  timestamp: string;
  alerts: Array<{
    type: 'temperature' | 'humidity' | 'light' | 'airflow';
    message: string;
    level: 'warning' | 'error';
  }>;
}

interface MonitorItemProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  status: 'normal' | 'warning' | 'error';
  range: {
    min: number;
    max: number;
  };
}

function MonitorItem({ title, value, unit, icon, status, range }: MonitorItemProps) {
  const getStatusColor = (status: 'normal' | 'warning' | 'error') => {
    switch (status) {
      case 'normal':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={cn("p-2 rounded-lg", status === 'normal' ? 'bg-green-50' : status === 'warning' ? 'bg-yellow-50' : 'bg-red-50')}>
            {icon}
          </div>
          <span className="font-medium">{title}</span>
        </div>
        <span className={cn("text-lg font-semibold", getStatusColor(status))}>
          {value} {unit}
        </span>
      </div>
      <div className="text-sm text-muted-foreground">
        正常范围：{range.min} - {range.max} {unit}
      </div>
    </div>
  );
}

export function IsolationPlantMonitor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EnvironmentData>({
    temperature: 25,
    humidity: 65,
    light: 800,
    airflow: 0.5,
    timestamp: new Date().toISOString(),
    alerts: [],
  });

  const checkStatus = (value: number, range: { min: number; max: number }) => {
    if (value < range.min || value > range.max) {
      return value < range.min - (range.max - range.min) * 0.2 || value > range.max + (range.max - range.min) * 0.2
        ? 'error'
        : 'warning';
    }
    return 'normal';
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // 模拟获取实时数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newData: EnvironmentData = {
        temperature: 25 + Math.random() * 2 - 1,
        humidity: 65 + Math.random() * 10 - 5,
        light: 800 + Math.random() * 200 - 100,
        airflow: 0.5 + Math.random() * 0.2 - 0.1,
        timestamp: new Date().toISOString(),
        alerts: [],
      };
      setData(newData);
    } catch (error) {
      console.error('Failed to fetch monitor data:', error);
      toast({
        title: '获取数据失败',
        description: '请检查设备连接',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 每30秒自动刷新一次数据
    const timer = setInterval(fetchData, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">环境监控</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={loading}
        >
          刷新数据
        </Button>
      </div>

      <div className="space-y-4">
        <MonitorItem
          title="温度"
          value={Number(data.temperature.toFixed(1))}
          unit="°C"
          icon={<Thermometer className="h-4 w-4 text-primary" />}
          status={checkStatus(data.temperature, { min: 20, max: 28 })}
          range={{ min: 20, max: 28 }}
        />
        <MonitorItem
          title="湿度"
          value={Number(data.humidity.toFixed(1))}
          unit="%"
          icon={<Droplets className="h-4 w-4 text-primary" />}
          status={checkStatus(data.humidity, { min: 50, max: 75 })}
          range={{ min: 50, max: 75 }}
        />
        <MonitorItem
          title="光照"
          value={Number(data.light.toFixed(0))}
          unit="lux"
          icon={<Sun className="h-4 w-4 text-primary" />}
          status={checkStatus(data.light, { min: 600, max: 1000 })}
          range={{ min: 600, max: 1000 }}
        />
        <MonitorItem
          title="气流"
          value={Number(data.airflow.toFixed(2))}
          unit="m/s"
          icon={<Wind className="h-4 w-4 text-primary" />}
          status={checkStatus(data.airflow, { min: 0.3, max: 0.8 })}
          range={{ min: 0.3, max: 0.8 }}
        />
      </div>

      {data.alerts.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center space-x-2 text-yellow-700 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">环境异常提醒</span>
          </div>
          <ul className="space-y-1 text-sm text-yellow-600">
            {data.alerts.map((alert, index) => (
              <li key={index}>{alert.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        最后更新：{new Date(data.timestamp).toLocaleString()}
      </div>
    </div>
  );
} 