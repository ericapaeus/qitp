'use client';

import { useState } from 'react';
import { FileEdit, Trash2, Eye, Award, Calendar } from 'lucide-react';
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

interface QuarantineStaff {
  id: string;
  organizationId: string;
  name: string;
  title: string;
  specialties: string[];
  certifications: Array<{
    type: string;
    no: string;
    issueDate: string;
    expiryDate: string;
  }>;
  status: 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED';
  syncTime: string;
}

interface SearchParams {
  keyword?: string;
  status?: QuarantineStaff['status'] | 'ALL';
  specialty?: string;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export function QuarantineStaffList({ organizationId }: { organizationId: string }) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    status: 'ALL',
  });
  const [staff, setStaff] = useState<QuarantineStaff[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<QuarantineStaff | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(pagination.page),
        pageSize: String(pagination.pageSize),
        ...(searchParams.keyword && { keyword: searchParams.keyword }),
        ...(searchParams.status && searchParams.status !== 'ALL' && { status: searchParams.status }),
        ...(searchParams.specialty && { specialty: searchParams.specialty }),
      });

      const response = await fetch(`/api/quarantine-organizations/${organizationId}/staff?${params}`);
      const result = await response.json();

      if (result.code === 200) {
        setStaff(result.data.items);
        setPagination(prev => ({
          ...prev,
          total: result.data.total,
        }));
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
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
    setSearchParams({ status: 'ALL' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/quarantine-organizations/${organizationId}/staff/${deleteId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.code === 200) {
        toast({
          title: '删除成功',
          description: '人员信息已删除',
        });
        fetchStaff();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to delete staff:', error);
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

  const renderStatus = (status: QuarantineStaff['status']) => {
    const statusMap = {
      ACTIVE: { label: '在岗', color: 'bg-green-500' },
      ON_LEAVE: { label: '请假', color: 'bg-yellow-500' },
      SUSPENDED: { label: '已停职', color: 'bg-red-500' },
    };

    const { label, color } = statusMap[status];

    return (
      <div className="flex items-center space-x-2">
        <div className={cn("h-2 w-2 rounded-full", color)} />
        <span>{label}</span>
      </div>
    );
  };

  const renderCertifications = (certifications: QuarantineStaff['certifications']) => {
    return (
      <div className="flex flex-wrap gap-2">
        {certifications.map((cert, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="cursor-help">
                <Award className="h-3 w-3 mr-1" />
                {cert.type}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <div className="font-medium">{cert.type}</div>
                <div className="text-xs">证书编号：{cert.no}</div>
                <div className="text-xs">
                  有效期：{formatDate(cert.issueDate)} ~ {formatDate(cert.expiryDate)}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  };

  const renderSpecialties = (specialties: string[]) => {
    return (
      <div className="flex flex-wrap gap-1">
        {specialties.map((specialty, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {specialty}
          </Badge>
        ))}
      </div>
    );
  };

  const renderDetails = (staff: QuarantineStaff) => (
    <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>检疫人员详情</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">姓名</div>
              <div className="font-medium">{staff.name}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">职称</div>
              <div className="font-medium">{staff.title}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">状态</div>
              <div className="font-medium">{renderStatus(staff.status)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">最近同步</div>
              <div className="font-medium">{formatDate(staff.syncTime)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">专业领域</div>
            <div>{renderSpecialties(staff.specialties)}</div>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">资质证书</div>
            <div className="grid gap-4">
              {staff.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{cert.type}</div>
                    <div className="text-sm text-muted-foreground">
                      证书编号：{cert.no}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>发证日期：{formatDate(cert.issueDate)}</div>
                    <div>到期日期：{formatDate(cert.expiryDate)}</div>
                  </div>
                </div>
              ))}
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
            placeholder="姓名/职称"
            value={searchParams.keyword}
            onChange={e => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>状态</Label>
          <Select
            value={searchParams.status}
            onValueChange={value => setSearchParams(prev => ({ ...prev, status: value as QuarantineStaff['status'] | 'ALL' }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部</SelectItem>
              <SelectItem value="ACTIVE">在岗</SelectItem>
              <SelectItem value="ON_LEAVE">请假</SelectItem>
              <SelectItem value="SUSPENDED">已停职</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>专业领域</Label>
          <Select
            value={searchParams.specialty}
            onValueChange={value => setSearchParams(prev => ({ ...prev, specialty: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择专业" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部</SelectItem>
              <SelectItem value="植物病理">植物病理</SelectItem>
              <SelectItem value="昆虫检疫">昆虫检疫</SelectItem>
              <SelectItem value="杂草检疫">杂草检疫</SelectItem>
              <SelectItem value="实验室检测">实验室检测</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end space-x-2">
          <Button onClick={handleSearch} disabled={loading}>搜索</Button>
          <Button variant="outline" onClick={handleReset} disabled={loading}>重置</Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>职称</TableHead>
              <TableHead>专业领域</TableHead>
              <TableHead>资质证书</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))
            ) : staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              staff.map(person => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell>{person.title}</TableCell>
                  <TableCell>{renderSpecialties(person.specialties)}</TableCell>
                  <TableCell>{renderCertifications(person.certifications)}</TableCell>
                  <TableCell>{renderStatus(person.status)}</TableCell>
                  <TableCell>{formatDate(person.syncTime)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedStaff(person)}
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
                            onClick={() => setDeleteId(person.id)}
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
              此操作将永久删除该人员信息，是否继续？
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

      {/* 详情对话框 */}
      {selectedStaff && renderDetails(selectedStaff)}
    </div>
  );
} 