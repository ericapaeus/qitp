'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Package, ClipboardCheck, AlertTriangle, RotateCw } from 'lucide-react';

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

export function IsolationSampleStats() {
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
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="待接收样品"
          value="5"
          description="等待接收登记的样品数量"
          icon={<Package className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="初检样品"
          value="8"
          description="正在进行初步检验的样品"
          icon={<ClipboardCheck className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="问题样品"
          value="2"
          description="需要特别关注的问题样品"
          icon={<AlertTriangle className="h-5 w-5 text-primary" />}
        />
      </div>
    </div>
  );
} 