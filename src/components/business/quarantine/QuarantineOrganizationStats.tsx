'use client';

import { Building2, Users, ClipboardCheck, RotateCw } from 'lucide-react';
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

export function QuarantineOrganizationStats() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/quarantine-organizations/sync', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.code === 200) {
        toast({
          title: '同步成功',
          description: `成功同步 ${result.data.syncCount} 条数据`,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to sync:', error);
      toast({
        title: '同步失败',
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
          onClick={handleSync}
          disabled={loading}
        >
          <RotateCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? '同步中...' : '同步数据'}
        </Button>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="机构总数"
          value="32"
          description="覆盖全国18个省份"
          icon={<Building2 className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="检疫人员"
          value="128"
          description="持证上岗人员"
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="检疫任务"
          value="1,234"
          description="本年度累计任务数"
          icon={<ClipboardCheck className="h-5 w-5 text-primary" />}
        />
      </div>
    </div>
  );
} 