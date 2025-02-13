'use client';

import { useState, useEffect } from 'react';
import { Plus, FileEdit, Trash2, Eye } from 'lucide-react';
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
import { ImportRecordForm, type FormValues } from './ImportRecordForm';

interface ImportRecord {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  approvalNo: string;
  quarantineCertNo?: string;
  plant: {
    name: string;
    scientificName: string;
    variety: string;
    sourceCountry: string;
    quantity: number;
    unit: string;
    purpose: string;
  };
  importInfo: {
    entryPort: string;
    plannedDate: string;
    actualDate?: string;
  };
  isolationInfo?: {
    facilityId: string;
    startDate?: string;
    endDate?: string;
  };
  status: 'PENDING' | 'IMPORTING' | 'ISOLATING' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

interface SearchParams {
  keyword?: string;
  status?: ImportRecord['status'] | 'ALL';
  dateRange?: DateRange;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

const mockImportRecords: ImportRecord[] = [
  {
    id: '1',
    enterpriseId: '1',
    enterpriseName: '示例企业一',
    approvalNo: 'AP2024001',
    plant: {
      name: '小麦',
      scientificName: 'Triticum aestivum',
      variety: '品种A',
      sourceCountry: '美国',
      quantity: 1000,
      unit: 'kg',
      purpose: '科研',
    },
    importInfo: {
      entryPort: '青岛港',
      plannedDate: '2024-03-15',
    },
    status: 'PENDING',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z',
  },
  // ... 更多模拟数据
];

export function ImportRecordList() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    status: 'ALL',
  });
  const [records, setRecords] = useState<ImportRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ImportRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ImportRecord | null>(null);

  useEffect(() => {
    fetchRecords();
  }, [pagination.page, pagination.pageSize, searchParams]);

  const fetchRecords = async () => {
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

      const response = await fetch(`/api/enterprises/imports?${params}`);
      const result = await response.json();

      if (result.code === 200) {
        setRecords(result.data.list);
        setPagination(prev => ({
          ...prev,
          total: result.data.total,
        }));
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
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
      const response = await fetch(`/api/enterprises/imports/${deleteId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.code === 200) {
        toast({
          title: '删除成功',
          description: '引种记录已删除',
        });
        fetchRecords();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to delete record:', error);
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

  const renderStatus = (status: ImportRecord['status']) => {
    const statusMap = {
      PENDING: { label: '待引进', color: 'bg-yellow-500' },
      IMPORTING: { label: '引进中', color: 'bg-blue-500' },
      ISOLATING: { label: '隔离中', color: 'bg-purple-500' },
      COMPLETED: { label: '已完成', color: 'bg-green-500' },
    };

    const { label, color } = statusMap[status];

    return (
      <div className="flex items-center space-x-2">
        <div className={cn("h-2 w-2 rounded-full", color)} />
        <span>{label}</span>
      </div>
    );
  };

  const handleFormSubmit = async (values: FormValues) => {
    try {
      setFormLoading(true);
      const response = await fetch('/api/enterprises/imports', {
        method: editingRecord ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (result.code === 200) {
        toast({
          title: `${editingRecord ? '更新' : '创建'}成功`,
          description: '引种记录已保存',
        });
        fetchRecords();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to save record:', error);
      toast({
        title: `${editingRecord ? '更新' : '创建'}失败`,
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
      setFormOpen(false);
      setEditingRecord(null);
    }
  };

  const renderDetails = (record: ImportRecord) => (
    <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>引种记录详情</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">基本信息</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">审批编号</span>
                <span>{record.approvalNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">企业名称</span>
                <span>{record.enterpriseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">状态</span>
                <span>{renderStatus(record.status)}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">植物信息</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">植物名称</span>
                <span>{record.plant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">学名</span>
                <span>{record.plant.scientificName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">品种</span>
                <span>{record.plant.variety}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">来源国</span>
                <span>{record.plant.sourceCountry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">数量</span>
                <span>{`${record.plant.quantity} ${record.plant.unit}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">用途</span>
                <span>{record.plant.purpose}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">引进信息</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">入境口岸</span>
                <span>{record.importInfo.entryPort}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">计划引进日期</span>
                <span>{formatDate(record.importInfo.plannedDate)}</span>
              </div>
              {record.importInfo.actualDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">实际引进日期</span>
                  <span>{formatDate(record.importInfo.actualDate)}</span>
                </div>
              )}
            </div>
          </div>
          {record.isolationInfo && (
            <div>
              <h3 className="font-semibold mb-2">隔离信息</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">隔离设施</span>
                  <span>{record.isolationInfo.facilityId}</span>
                </div>
                {record.isolationInfo.startDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">开始日期</span>
                    <span>{formatDate(record.isolationInfo.startDate)}</span>
                  </div>
                )}
                {record.isolationInfo.endDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">结束日期</span>
                    <span>{formatDate(record.isolationInfo.endDate)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
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
            placeholder="企业名称/审批编号"
            value={searchParams.keyword}
            onChange={e => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>状态</Label>
          <Select
            value={searchParams.status}
            onValueChange={value => setSearchParams(prev => ({ ...prev, status: value as ImportRecord['status'] | 'ALL' }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部</SelectItem>
              <SelectItem value="PENDING">待引进</SelectItem>
              <SelectItem value="IMPORTING">引进中</SelectItem>
              <SelectItem value="ISOLATING">隔离中</SelectItem>
              <SelectItem value="COMPLETED">已完成</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>引进日期</Label>
          <DateRangePicker
            value={searchParams.dateRange}
            onChange={range => setSearchParams(prev => ({ ...prev, dateRange: range }))}
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
              setEditingRecord(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            新增引种
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>审批编号</TableHead>
              <TableHead>企业名称</TableHead>
              <TableHead>植物名称</TableHead>
              <TableHead>来源国</TableHead>
              <TableHead>引进数量</TableHead>
              <TableHead>计划引进日期</TableHead>
              <TableHead>状态</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              records.map(record => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.approvalNo}</TableCell>
                  <TableCell>{record.enterpriseName}</TableCell>
                  <TableCell>{record.plant.name}</TableCell>
                  <TableCell>{record.plant.sourceCountry}</TableCell>
                  <TableCell>{`${record.plant.quantity} ${record.plant.unit}`}</TableCell>
                  <TableCell>{formatDate(record.importInfo.plannedDate)}</TableCell>
                  <TableCell>{renderStatus(record.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedRecord(record)}
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
                            onClick={() => {
                              setEditingRecord(record);
                              setFormOpen(true);
                            }}
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
                            onClick={() => setDeleteId(record.id)}
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
              此操作将永久删除该引种记录，是否继续？
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

      {/* 添加表单组件 */}
      <ImportRecordForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingRecord || undefined}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      {selectedRecord && renderDetails(selectedRecord)}
    </div>
  );
} 