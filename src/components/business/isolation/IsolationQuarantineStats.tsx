'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ClipboardList, RotateCw, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

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

export function IsolationQuarantineStats() {
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
          title="待处理"
          value="12"
          description="等待检疫处理的样品"
          icon={<ClipboardList className="h-5 w-5 text-primary" />}
          trend={{ value: 20, isUp: true }}
        />
        <StatsCard
          title="处理中"
          value="8"
          description="正在进行处理的样品"
          icon={<RefreshCw className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="待复检"
          value="3"
          description="需要进行复检的样品"
          icon={<AlertTriangle className="h-5 w-5 text-primary" />}
          trend={{ value: 15, isUp: false }}
        />
        <StatsCard
          title="已完成"
          value="156"
          description="本年度完成处理的样品"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
        />
      </div>
    </div>
  );
} 