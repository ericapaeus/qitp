'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Sprout, Clock, AlertTriangle, RotateCw, CheckCircle2 } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-primary/10 p-3">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold tracking-tight">{value}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{description}</p>
            {trend && (
              <span className={`text-sm ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isUp ? '↑' : '↓'} {trend.value}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function IsolationPlantStats() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      // TODO: 调用刷新统计数据接口
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: '刷新成功',
        description: '统计数据已更新',
      });
    } catch (error) {
      console.error('Failed to refresh stats:', error);
      toast({
        title: '刷新失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">数据概览</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RotateCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? '刷新中...' : '刷新数据'}
        </Button>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="试种中"
          value="32"
          description="正在进行试种的样品"
          icon={<Sprout className="h-5 w-5 text-primary" />}
          trend={{ value: 12, isUp: true }}
        />
        <StatsCard
          title="观察期"
          value="15"
          description="处于观察期的样品"
          icon={<Clock className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="异常样品"
          value="3"
          description="生长出现异常的样品"
          icon={<AlertTriangle className="h-5 w-5 text-primary" />}
          trend={{ value: 25, isUp: false }}
        />
        <StatsCard
          title="已完成"
          value="128"
          description="本年度完成试种的样品"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
        />
      </div>
    </div>
  );
} 