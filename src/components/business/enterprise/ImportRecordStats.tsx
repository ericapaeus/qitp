'use client';

import { Sprout, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-primary/10 p-3">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold tracking-tight">{value}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}

export function ImportRecordStats() {
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
        <h2 className="text-lg font-semibold">引种概览</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
        >
          <Clock className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? '刷新中...' : '刷新数据'}
        </Button>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="总引种数"
          value="256"
          description="本年度累计引种批次"
          icon={<Sprout className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="进行中"
          value="45"
          description="引进中和隔离中的批次"
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="已完成"
          value="211"
          description="已完成检疫的批次"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
        />
      </div>
    </div>
  );
} 