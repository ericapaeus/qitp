'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
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
import { DateRangePicker } from '@/components/ui/date-range-picker';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Pagination } from '@/components/ui/pagination';
import { formatDate } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { EnterpriseForm } from './EnterpriseForm';
import type { FormValues } from './EnterpriseForm';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Enterprise {
  id: string;
  code: string;
  name: string;
  contact: {
    address: string;
    person: string;
    phone: string;
  };
  status: 'ACTIVE' | 'SUSPENDED';
  syncTime: string;
  syncStatus?: 'SUCCESS' | 'FAILED' | 'SYNCING' | null;
  lastSyncError?: string;
}

interface SearchParams {
  keyword?: string;
  status?: Enterprise['status'] | 'ALL';
  dateRange?: DateRange;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

const mockEnterprises: Enterprise[] = [
  {
    id: '1',
    code: 'ENT001',
    name: '示例企业一',
    contact: {
      address: '北京市海淀区',
      person: '张三',
      phone: '13800138000',
    },
    status: 'ACTIVE',
    syncTime: '2024-02-20 10:00:00',
  },
  // ... 更多模拟数据
];

export function EnterpriseList() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    status: 'ALL',
  });
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingEnterprise, setEditingEnterprise] = useState<Enterprise | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchEnterprises = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(pagination.page),
        pageSize: String(pagination.pageSize),
        ...(searchParams.keyword && { keyword: searchParams.keyword }),
        ...(searchParams.status && searchParams.status !== 'ALL' && { status: searchParams.status }),
        ...(searchParams.dateRange?.from && { startDate: searchParams.dateRange.from.toISOString() }),
        ...(searchParams.dateRange?.to && { endDate: searchParams.dateRange.to.toISOString() }),
      });

      const response = await fetch(`/api/enterprises?${params}`);
      const result = await response.json();

      if (result.code === 200) {
        setEnterprises(result.data.list);
        setPagination(prev => ({
          ...prev,
          total: result.data.total,
        }));
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to fetch enterprises:', error);
      toast({
        title: '获取数据失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnterprises();
  }, [pagination.page, pagination.pageSize, searchParams]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleReset = () => {
    setSearchParams({ status: 'ALL' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        ...(searchParams.keyword && { keyword: searchParams.keyword }),
        ...(searchParams.status && searchParams.status !== 'ALL' && { status: searchParams.status }),
        ...(searchParams.dateRange?.from && { startDate: searchParams.dateRange.from.toISOString() }),
        ...(searchParams.dateRange?.to && { endDate: searchParams.dateRange.to.toISOString() }),
        export: 'true',
      });

      const response = await fetch(`/api/enterprises?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `企业列表_${formatDate(new Date(), 'YYYY-MM-DD')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: '导出成功',
        description: '文件已开始下载',
      });
    } catch (error) {
      console.error('Failed to export:', error);
      toast({
        title: '导出失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, status: value as Enterprise['status'] | 'ALL' }));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setSearchParams(prev => ({ ...prev, dateRange: range }));
  };

  const handleViewDetails = (enterprise: Enterprise) => {
    setSelectedEnterprise(enterprise);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setFormLoading(true);
      const response = await fetch('/api/enterprises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (result.code === 200) {
        toast({
          title: '保存成功',
          description: '企业信息已更新',
        });
        fetchEnterprises();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to save enterprise:', error);
      toast({
        title: '保存失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/enterprises/${deleteId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.code === 200) {
        toast({
          title: '删除成功',
          description: '企业信息已删除',
        });
        fetchEnterprises();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to delete enterprise:', error);
      toast({
        title: '删除失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const renderSyncStatus = (enterprise: Enterprise) => {
    const syncTime = new Date(enterprise.syncTime);
    const timeAgo = formatDistanceToNow(syncTime, { locale: zhCN, addSuffix: true });

    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2 cursor-default">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                enterprise.syncStatus === 'SUCCESS' && "bg-green-500",
                enterprise.syncStatus === 'FAILED' && "bg-red-500",
                enterprise.syncStatus === 'SYNCING' && "bg-yellow-500 animate-pulse",
                !enterprise.syncStatus && "bg-gray-300"
              )}
            />
            <span className="text-sm text-muted-foreground">{timeAgo}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="text-sm">
            {enterprise.syncStatus === 'SUCCESS' && '同步成功'}
            {enterprise.syncStatus === 'FAILED' && (
              <div>
                <div>同步失败</div>
                {enterprise.lastSyncError && (
                  <div className="text-xs text-destructive">{enterprise.lastSyncError}</div>
                )}
              </div>
            )}
            {enterprise.syncStatus === 'SYNCING' && '正在同步...'}
            {!enterprise.syncStatus && '未同步'}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="space-y-6">
      {/* 搜索区域 */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label>关键词搜索</Label>
          <Input
            placeholder="企业名称/编号"
            value={searchParams.keyword}
            onChange={e => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>企业状态</Label>
          <Select
            value={searchParams.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部</SelectItem>
              <SelectItem value="ACTIVE">活跃</SelectItem>
              <SelectItem value="SUSPENDED">已暂停</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>同步时间</Label>
          <DateRangePicker
            value={searchParams.dateRange}
            onValueChange={handleDateRangeChange}
          />
        </div>
        <div className="flex items-end space-x-2">
          <Button onClick={handleSearch} disabled={loading}>搜索</Button>
          <Button variant="outline" onClick={handleReset} disabled={loading}>重置</Button>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="flex justify-between">
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setEditingEnterprise(null);
              setFormOpen(true);
            }}
            disabled={loading}
          >
            <Plus className="mr-2 h-4 w-4" />
            新增企业
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            disabled={loading}
          >
            导出
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>企业编号</TableHead>
              <TableHead>企业名称</TableHead>
              <TableHead>联系人</TableHead>
              <TableHead>联系电话</TableHead>
              <TableHead>地址</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>同步时间</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                </TableRow>
              ))
            ) : enterprises.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              enterprises.map(enterprise => (
                <TableRow key={enterprise.id}>
                  <TableCell className="font-medium">{enterprise.code}</TableCell>
                  <TableCell>{enterprise.name}</TableCell>
                  <TableCell>{enterprise.contact.person}</TableCell>
                  <TableCell>{enterprise.contact.phone}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {enterprise.contact.address}
                  </TableCell>
                  <TableCell>
                    <Badge variant={enterprise.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {enterprise.status === 'ACTIVE' ? '活跃' : '已暂停'}
                    </Badge>
                  </TableCell>
                  <TableCell>{renderSyncStatus(enterprise)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingEnterprise(enterprise);
                          setFormOpen(true);
                        }}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(enterprise.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

      {/* 企业表单 */}
      <EnterpriseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingEnterprise || undefined}
        onSubmit={handleSubmit}
        loading={formLoading}
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除该企业信息，是否继续？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 