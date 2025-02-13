'use client';

import { Building2, Users, TrendingUp, RotateCw } from 'lucide-react';
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

export function EnterpriseStats() {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    try {
      setSyncing(true);
      // TODO: 调用同步接口
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: '同步成功',
        description: '企业数据已更新',
      });
    } catch (error) {
      toast({
        title: '同步失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">数据概览</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={syncing}
        >
          <RotateCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? '同步中...' : '同步数据'}
        </Button>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="总企业数"
          value="128"
          description="较上月增长 12%"
          icon={<Building2 className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="活跃企业"
          value="98"
          description="本月有引种记录的企业"
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="引种总量"
          value="1,234"
          description="本年度累计引种批次"
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
        />
      </div>
    </div>
  );
} 