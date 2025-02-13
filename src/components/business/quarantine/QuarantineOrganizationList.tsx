'use client';

import { useState } from 'react';
import { Plus, FileEdit, Trash2, Eye, History } from 'lucide-react';
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
import type { FormValues } from './QuarantineOrganizationForm';

interface QuarantineOrganization {
  id: string;
  code: string;
  name: string;
  level: 'PROVINCE' | 'CITY';
  region: {
    province: string;
    city?: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  status: 'ACTIVE' | 'SUSPENDED';
  syncTime: string;
}

interface SearchParams {
  keyword?: string;
  level?: QuarantineOrganization['level'] | 'ALL';
  status?: QuarantineOrganization['status'] | 'ALL';
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface QuarantineOrganizationListProps {
  onEdit?: (organization: FormValues) => void;
  onSearchParamsChange?: (params: Record<string, any>) => void;
}

const defaultOrganization: FormValues = {
  code: '',
  name: '',
  level: 'PROVINCE',
  region: {
    province: '',
  },
  contact: {
    address: '',
    phone: '',
    email: '',
  },
  status: 'ACTIVE',
};

export function QuarantineOrganizationList({
  onEdit,
  onSearchParamsChange,
}: QuarantineOrganizationListProps) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    level: 'ALL',
    status: 'ALL',
  });
  const [organizations, setOrganizations] = useState<QuarantineOrganization[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<QuarantineOrganization | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [syncHistoryOpen, setSyncHistoryOpen] = useState(false);
  const [syncHistory, setSyncHistory] = useState<Array<{
    id: string;
    type: 'ORGANIZATION' | 'STAFF';
    status: 'SUCCESS' | 'FAILED';
    errorMessage?: string;
    createdAt: string;
  }>>([]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(pagination.page),
        pageSize: String(pagination.pageSize),
        ...(searchParams.keyword && { keyword: searchParams.keyword }),
        ...(searchParams.level && searchParams.level !== 'ALL' && { level: searchParams.level }),
        ...(searchParams.status && searchParams.status !== 'ALL' && { status: searchParams.status }),
      });

      onSearchParamsChange?.({
        keyword: searchParams.keyword,
        level: searchParams.level,
        status: searchParams.status,
      });

      const response = await fetch(`/api/quarantine-organizations?${params}`);
      const result = await response.json();

      if (result.code === 200) {
        setOrganizations(result.data.items);
        setPagination(prev => ({
          ...prev,
          total: result.data.total,
        }));
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      toast({
        title: '获取数据失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSyncHistory = async (organizationId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quarantine-organizations/${organizationId}/sync-history`);
      const result = await response.json();

      if (result.code === 200) {
        setSyncHistory(result.data.items);
        setSyncHistoryOpen(true);
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

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleReset = () => {
    setSearchParams({ level: 'ALL', status: 'ALL' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/quarantine-organizations/${deleteId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.code === 200) {
        toast({
          title: '删除成功',
          description: '机构信息已删除',
        });
        fetchOrganizations();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to delete organization:', error);
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

  const handleEdit = (organization: QuarantineOrganization) => {
    if (onEdit) {
      onEdit({
        code: organization.code,
        name: organization.name,
        level: organization.level,
        region: organization.region,
        contact: organization.contact,
        status: organization.status,
      });
    }
  };

  const renderStatus = (status: QuarantineOrganization['status']) => {
    const statusMap = {
      ACTIVE: { label: '正常', color: 'bg-green-500' },
      SUSPENDED: { label: '已暂停', color: 'bg-yellow-500' },
    };

    const { label, color } = statusMap[status];

    return (
      <div className="flex items-center space-x-2">
        <div className={cn("h-2 w-2 rounded-full", color)} />
        <span>{label}</span>
      </div>
    );
  };

  const renderSyncHistory = () => (
    <Dialog open={syncHistoryOpen} onOpenChange={setSyncHistoryOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>同步历史</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {syncHistory.map(record => (
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
            placeholder="机构名称/编号"
            value={searchParams.keyword}
            onChange={e => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>机构级别</Label>
          <Select
            value={searchParams.level}
            onValueChange={value => setSearchParams(prev => ({ ...prev, level: value as QuarantineOrganization['level'] | 'ALL' }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择级别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部</SelectItem>
              <SelectItem value="PROVINCE">省级</SelectItem>
              <SelectItem value="CITY">市级</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>状态</Label>
          <Select
            value={searchParams.status}
            onValueChange={value => setSearchParams(prev => ({ ...prev, status: value as QuarantineOrganization['status'] | 'ALL' }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部</SelectItem>
              <SelectItem value="ACTIVE">正常</SelectItem>
              <SelectItem value="SUSPENDED">已暂停</SelectItem>
            </SelectContent>
          </Select>
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
            onClick={() => onEdit?.(defaultOrganization)}
          >
            <Plus className="mr-2 h-4 w-4" />
            新增机构
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>机构编号</TableHead>
              <TableHead>机构名称</TableHead>
              <TableHead>级别</TableHead>
              <TableHead>所属地区</TableHead>
              <TableHead>联系电话</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>最近同步</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pagination.pageSize }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))
            ) : organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              organizations.map(organization => (
                <TableRow key={organization.id}>
                  <TableCell className="font-medium">{organization.code}</TableCell>
                  <TableCell>{organization.name}</TableCell>
                  <TableCell>{organization.level === 'PROVINCE' ? '省级' : '市级'}</TableCell>
                  <TableCell>
                    {organization.region.province}
                    {organization.region.city && ` - ${organization.region.city}`}
                  </TableCell>
                  <TableCell>{organization.contact.phone}</TableCell>
                  <TableCell>{renderStatus(organization.status)}</TableCell>
                  <TableCell>{formatDate(organization.syncTime)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrganization(organization)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>查看详情</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(organization)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>编辑</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => fetchSyncHistory(organization.id)}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>同步历史</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(organization.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>删除</TooltipContent>
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

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除该机构信息，是否继续？
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

      {/* 同步历史对话框 */}
      {renderSyncHistory()}
    </div>
  );
} 