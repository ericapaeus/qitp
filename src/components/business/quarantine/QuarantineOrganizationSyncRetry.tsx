'use client';

import { useState } from 'react';
import { AlertTriangle, RotateCw, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SyncFailure {
  id: string;
  organizationId: string;
  organizationName: string;
  type: 'ORGANIZATION' | 'STAFF' | 'TASK' | 'RESULT';
  errorMessage: string;
  retryCount: number;
  lastRetryTime?: string;
  status: 'PENDING' | 'RETRYING' | 'RESOLVED' | 'FAILED';
  createdAt: string;
}

interface QuarantineOrganizationSyncRetryProps {
  failures: SyncFailure[];
  onRetry: (id: string) => Promise<void>;
  onRetryAll: () => Promise<void>;
  className?: string;
}

export function QuarantineOrganizationSyncRetry({
  failures,
  onRetry,
  onRetryAll,
  className,
}: QuarantineOrganizationSyncRetryProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedFailure, setSelectedFailure] = useState<SyncFailure | null>(null);
  const [retryStrategy, setRetryStrategy] = useState('immediate');
  const [maxRetries, setMaxRetries] = useState('3');

  const handleRetry = async (failure: SyncFailure) => {
    try {
      setLoading(true);
      await onRetry(failure.id);
      toast({
        title: '重试成功',
        description: '同步任务已重新执行',
      });
    } catch (error) {
      console.error('Failed to retry sync:', error);
      toast({
        title: '重试失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setSelectedFailure(null);
    }
  };

  const handleRetryAll = async () => {
    try {
      setLoading(true);
      await onRetryAll();
      toast({
        title: '批量重试成功',
        description: '所有失败的同步任务已重新执行',
      });
    } catch (error) {
      console.error('Failed to retry all:', error);
      toast({
        title: '批量重试失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status: SyncFailure['status']) => {
    const statusMap = {
      PENDING: { label: '待重试', icon: AlertTriangle, color: 'text-yellow-500' },
      RETRYING: { label: '重试中', icon: RotateCw, color: 'text-blue-500' },
      RESOLVED: { label: '已解决', icon: CheckCircle2, color: 'text-green-500' },
      FAILED: { label: '已失败', icon: XCircle, color: 'text-red-500' },
    };

    const { label, icon: Icon, color } = statusMap[status];

    return (
      <div className="flex items-center space-x-2">
        <Icon className={cn("h-4 w-4", color)} />
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className={cn("border rounded-lg", className)}>
      <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
        <h3 className="font-semibold">同步失败任务</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetryAll}
          disabled={loading || failures.length === 0}
        >
          <RotateCw className="mr-2 h-4 w-4" />
          批量重试
        </Button>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-4">
          {failures.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              暂无同步失败记录
            </div>
          ) : (
            failures.map((failure) => (
              <div
                key={failure.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-2">
                  <div className="font-medium">{failure.organizationName}</div>
                  <div className="text-sm text-muted-foreground">
                    {failure.errorMessage}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div>重试次数：{failure.retryCount}</div>
                    {failure.lastRetryTime && (
                      <div>最近重试：{formatDate(failure.lastRetryTime)}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {renderStatus(failure.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFailure(failure)}
                    disabled={loading || failure.status === 'RESOLVED'}
                  >
                    重试
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <Dialog open={!!selectedFailure} onOpenChange={() => setSelectedFailure(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重试同步任务</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>重试策略</Label>
              <Select
                value={retryStrategy}
                onValueChange={setRetryStrategy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择重试策略" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">立即重试</SelectItem>
                  <SelectItem value="exponential">指数退避重试</SelectItem>
                  <SelectItem value="fixed">固定间隔重试</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>最大重试次数</Label>
              <Select
                value={maxRetries}
                onValueChange={setMaxRetries}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择最大重试次数" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 次</SelectItem>
                  <SelectItem value="3">3 次</SelectItem>
                  <SelectItem value="5">5 次</SelectItem>
                  <SelectItem value="10">10 次</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedFailure(null)}
            >
              取消
            </Button>
            <Button
              onClick={() => selectedFailure && handleRetry(selectedFailure)}
              disabled={loading}
            >
              {loading ? '重试中...' : '确定'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 