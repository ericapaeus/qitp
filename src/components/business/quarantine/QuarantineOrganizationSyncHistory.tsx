'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

interface SyncRecord {
  id: string;
  type: 'ORGANIZATION' | 'STAFF';
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
  createdAt: string;
}

interface QuarantineOrganizationSyncHistoryProps {
  organizationId: string;
  className?: string;
}

export function QuarantineOrganizationSyncHistory({
  organizationId,
  className,
}: QuarantineOrganizationSyncHistoryProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<SyncRecord[]>([]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quarantine-organizations/${organizationId}/sync-history`);
      const result = await response.json();

      if (result.code === 200) {
        setHistory(result.data.items);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to fetch sync history:', error);
      toast({
        title: '获取同步历史失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [organizationId]);

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className={cn("text-center text-muted-foreground py-8", className)}>
        暂无同步记录
      </div>
    );
  }

  return (
    <ScrollArea className={cn("h-[400px] pr-4", className)}>
      <div className="space-y-4">
        {history.map(record => (
          <div
            key={record.id}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg border",
              record.status === 'SUCCESS' ? 'bg-green-50' : 'bg-red-50'
            )}
          >
            <div className="space-y-1">
              <div className="font-medium">
                {record.type === 'ORGANIZATION' ? '机构信息同步' : '人员信息同步'}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(record.createdAt)}
              </div>
              {record.errorMessage && (
                <div className="text-sm text-red-600">{record.errorMessage}</div>
              )}
            </div>
            <Badge
              variant={record.status === 'SUCCESS' ? 'default' : 'destructive'}
            >
              {record.status === 'SUCCESS' ? '成功' : '失败'}
            </Badge>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
} 