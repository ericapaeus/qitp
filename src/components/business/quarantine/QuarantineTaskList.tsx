'use client';

import { useState } from 'react';
import { Eye, ClipboardCheck, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Pagination } from '@/components/ui/pagination';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface QuarantineTask {
  id: string;
  organizationId: string;
  type: 'PRELIMINARY' | 'ISOLATION' | 'LABORATORY';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignee: {
    id: string;
    name: string;
  };
  subject: {
    type: string;
    name: string;
    quantity: number;
    unit: string;
  };
  progress: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface SearchParams {
  keyword?: string;
  type?: QuarantineTask['type'] | 'ALL';
  status?: QuarantineTask['status'] | 'ALL';
  dateRange?: DateRange;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export function QuarantineTaskList({ organizationId }: { organizationId: string }) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    type: 'ALL',
    status: 'ALL',
  });
  const [tasks, setTasks] = useState<QuarantineTask[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<QuarantineTask | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(pagination.page),
        pageSize: String(pagination.pageSize),
        ...(searchParams.keyword && { keyword: searchParams.keyword }),
        ...(searchParams.type && searchParams.type !== 'ALL' && { type: searchParams.type }),
        ...(searchParams.status && searchParams.status !== 'ALL' && { status: searchParams.status }),
        ...(searchParams.dateRange?.from && { startDate: searchParams.dateRange.from.toISOString() }),
        ...(searchParams.dateRange?.to && { endDate: searchParams.dateRange.to.toISOString() }),
      });

      const response = await fetch(`/api/quarantine-organizations/${organizationId}/tasks?${params}`);
      const result = await response.json();

      if (result.code === 200) {
        setTasks(result.data.items);
        setPagination(prev => ({
          ...prev,
          total: result.data.total,
        }));
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast({
        title: '获取数据失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleReset = () => {
    setSearchParams({ type: 'ALL', status: 'ALL' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const renderType = (type: QuarantineTask['type']) => {
    const typeMap = {
      PRELIMINARY: { label: '初检', color: 'bg-blue-500' },
      ISOLATION: { label: '隔离检疫', color: 'bg-purple-500' },
      LABORATORY: { label: '实验室检测', color: 'bg-orange-500' },
    };

    const { label, color } = typeMap[type];

    return (
      <div className="flex items-center space-x-2">
        <div className={cn("h-2 w-2 rounded-full", color)} />
        <span>{label}</span>
      </div>
    );
  };

  const renderStatus = (status: QuarantineTask['status']) => {
    const statusMap = {
      PENDING: { label: '待处理', color: 'bg-yellow-500' },
      IN_PROGRESS: { label: '进行中', color: 'bg-blue-500' },
      COMPLETED: { label: '已完成', color: 'bg-green-500' },
      FAILED: { label: '未通过', color: 'bg-red-500' },
    };

    const { label, color } = statusMap[status];

    return (
      <div className="flex items-center space-x-2">
        <div className={cn("h-2 w-2 rounded-full", color)} />
        <span>{label}</span>
      </div>
    );
  };

  const renderPriority = (priority: QuarantineTask['priority']) => {
    const priorityMap = {
      LOW: { label: '低', color: 'text-green-600 bg-green-50' },
      MEDIUM: { label: '中', color: 'text-yellow-600 bg-yellow-50' },
      HIGH: { label: '高', color: 'text-red-600 bg-red-50' },
    };

    const { label, color } = priorityMap[priority];

    return (
      <Badge variant="outline" className={cn("font-medium", color)}>
        {label}
      </Badge>
    );
  };

  const renderProgress = (progress: number) => {
    const getColor = (value: number) => {
      if (value < 30) return 'bg-red-500';
      if (value < 70) return 'bg-yellow-500';
      return 'bg-green-500';
    };

    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full", getColor(progress))}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
    );
  };

  const renderDetails = (task: QuarantineTask) => (
    <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>检疫任务详情</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">任务类型</div>
              <div className="font-medium">{renderType(task.type)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">任务状态</div>
              <div className="font-medium">{renderStatus(task.status)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">优先级</div>
              <div className="font-medium">{renderPriority(task.priority)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">负责人</div>
              <div className="font-medium">{task.assignee.name}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">检疫对象</div>
            <div className="p-4 rounded-lg border space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">类型</span>
                <span>{task.subject.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">名称</span>
                <span>{task.subject.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">数量</span>
                <span>{task.subject.quantity} {task.subject.unit}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">任务进度</div>
            <div className="p-4 rounded-lg border space-y-4">
              {renderProgress(task.progress)}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">开始时间</div>
                  <div>{task.startDate ? formatDate(task.startDate) : '未开始'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">结束时间</div>
                  <div>{task.endDate ? formatDate(task.endDate) : '未完成'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* 搜索区域 */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label>关键词搜索</Label>
          <Input
            placeholder="检疫对象/负责人"
            value={searchParams.keyword}
            onChange={e => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>任务类型</Label>
          <Select
            value={searchParams.type}
            onValueChange={value => setSearchParams(prev => ({ ...prev, type: value as QuarantineTask['type'] | 'ALL' }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部</SelectItem>
              <SelectItem value="PRELIMINARY">初检</SelectItem>
              <SelectItem value="ISOLATION">隔离检疫</SelectItem>
              <SelectItem value="LABORATORY">实验室检测</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>任务状态</Label>
          <Select
            value={searchParams.status}
            onValueChange={value => setSearchParams(prev => ({ ...prev, status: value as QuarantineTask['status'] | 'ALL' }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部</SelectItem>
              <SelectItem value="PENDING">待处理</SelectItem>
              <SelectItem value="IN_PROGRESS">进行中</SelectItem>
              <SelectItem value="COMPLETED">已完成</SelectItem>
              <SelectItem value="FAILED">未通过</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>时间范围</Label>
          <DateRangePicker
            value={searchParams.dateRange}
            onChange={range => setSearchParams(prev => ({ ...prev, dateRange: range }))}
          />
        </div>
        <div className="flex items-end space-x-2 md:col-span-4">
          <Button onClick={handleSearch} disabled={loading}>搜索</Button>
          <Button variant="outline" onClick={handleReset} disabled={loading}>重置</Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>任务类型</TableHead>
              <TableHead>检疫对象</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>优先级</TableHead>
              <TableHead>进度</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>开始时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pagination.pageSize }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              tasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>{renderType(task.type)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.subject.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {task.subject.quantity} {task.subject.unit}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{task.assignee.name}</TableCell>
                  <TableCell>{renderPriority(task.priority)}</TableCell>
                  <TableCell>{renderProgress(task.progress)}</TableCell>
                  <TableCell>{renderStatus(task.status)}</TableCell>
                  <TableCell>
                    {task.startDate ? formatDate(task.startDate) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedTask(task)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>查看详情</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      <div className="flex justify-end">
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) =>
            setPagination(prev => ({ ...prev, page, pageSize }))
          }
        />
      </div>

      {/* 详情对话框 */}
      {selectedTask && renderDetails(selectedTask)}
    </div>
  );
} 