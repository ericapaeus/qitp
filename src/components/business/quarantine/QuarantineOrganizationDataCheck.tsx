'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ArrowRightLeft, RefreshCw } from 'lucide-react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataDifference {
  id: string;
  organizationId: string;
  organizationName: string;
  type: 'ORGANIZATION' | 'STAFF' | 'TASK' | 'RESULT';
  field: string;
  localValue: string;
  remoteValue: string;
  checkTime: string;
}

interface QuarantineOrganizationDataCheckProps {
  differences: DataDifference[];
  onSync: (ids: string[]) => Promise<void>;
  onCheck: () => Promise<void>;
  className?: string;
}

export function QuarantineOrganizationDataCheck({
  differences,
  onSync,
  onCheck,
  className,
}: QuarantineOrganizationDataCheckProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDiff, setSelectedDiff] = useState<DataDifference | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleCheck = async () => {
    try {
      setLoading(true);
      await onCheck();
      toast({
        title: '检查完成',
        description: '数据一致性检查已完成',
      });
    } catch (error) {
      console.error('Failed to check data:', error);
      toast({
        title: '检查失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (selectedIds.length === 0) return;

    try {
      setLoading(true);
      await onSync(selectedIds);
      toast({
        title: '同步成功',
        description: '已同步选中的数据差异',
      });
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to sync data:', error);
      toast({
        title: '同步失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev =>
      prev.length === differences.length
        ? []
        : differences.map(d => d.id)
    );
  };

  return (
    <div className={cn("border rounded-lg", className)}>
      <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold">数据一致性检查</h3>
          <p className="text-sm text-muted-foreground">
            最近检查时间：{differences[0]?.checkTime ? formatDate(differences[0].checkTime) : '暂无检查'}
          </p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCheck}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            检查
          </Button>
          <Button
            size="sm"
            onClick={handleSync}
            disabled={loading || selectedIds.length === 0}
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            同步选中项
          </Button>
        </div>
      </div>
      <div className="p-4">
        {differences.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
            <p className="mt-2 text-muted-foreground">数据一致性检查通过</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === differences.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>机构名称</TableHead>
                <TableHead>数据类型</TableHead>
                <TableHead>字段</TableHead>
                <TableHead>本地值</TableHead>
                <TableHead>远程值</TableHead>
                <TableHead>检查时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {differences.map((diff) => (
                <TableRow
                  key={diff.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedDiff(diff)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(diff.id)}
                      onChange={() => toggleSelect(diff.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>{diff.organizationName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {diff.type === 'ORGANIZATION' && '机构信息'}
                      {diff.type === 'STAFF' && '人员信息'}
                      {diff.type === 'TASK' && '任务信息'}
                      {diff.type === 'RESULT' && '结果信息'}
                    </Badge>
                  </TableCell>
                  <TableCell>{diff.field}</TableCell>
                  <TableCell className="font-mono text-sm">{diff.localValue}</TableCell>
                  <TableCell className="font-mono text-sm">{diff.remoteValue}</TableCell>
                  <TableCell>{formatDate(diff.checkTime)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!selectedDiff} onOpenChange={() => setSelectedDiff(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>数据差异详情</DialogTitle>
          </DialogHeader>
          {selectedDiff && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">机构名称</div>
                  <div className="mt-1">{selectedDiff.organizationName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">数据类型</div>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {selectedDiff.type === 'ORGANIZATION' && '机构信息'}
                      {selectedDiff.type === 'STAFF' && '人员信息'}
                      {selectedDiff.type === 'TASK' && '任务信息'}
                      {selectedDiff.type === 'RESULT' && '结果信息'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">差异字段</div>
                <div className="mt-1">{selectedDiff.field}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">本地值</div>
                  <div className="mt-1 p-2 rounded bg-muted font-mono text-sm">
                    {selectedDiff.localValue}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">远程值</div>
                  <div className="mt-1 p-2 rounded bg-muted font-mono text-sm">
                    {selectedDiff.remoteValue}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedDiff(null)}
            >
              关闭
            </Button>
            <Button
              onClick={() => {
                if (selectedDiff) {
                  onSync([selectedDiff.id]);
                  setSelectedDiff(null);
                }
              }}
              disabled={loading}
            >
              同步此项
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 