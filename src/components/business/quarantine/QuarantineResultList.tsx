'use client';

import { useState } from 'react';
import { Eye, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
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

interface QuarantineResult {
  id: string;
  organizationId: string;
  taskId: string;
  conclusion: 'PASS' | 'FAIL' | 'NEED_PROCESS';
  inspector: {
    id: string;
    name: string;
  };
  subject: {
    type: string;
    name: string;
    quantity: number;
    unit: string;
  };
  findings: Array<{
    type: 'PEST' | 'DISEASE' | 'WEED' | 'OTHER';
    name: string;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
  }>;
  processingMethod?: string;
  inspectionDate: string;
  createdAt: string;
}

interface SearchParams {
  keyword?: string;
  conclusion?: QuarantineResult['conclusion'] | 'ALL';
  dateRange?: DateRange;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export function QuarantineResultList({ organizationId }: { organizationId: string }) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    conclusion: 'ALL',
  });
  const [results, setResults] = useState<QuarantineResult[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<QuarantineResult | null>(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(pagination.page),
        pageSize: String(pagination.pageSize),
        ...(searchParams.keyword && { keyword: searchParams.keyword }),
        ...(searchParams.conclusion && searchParams.conclusion !== 'ALL' && { conclusion: searchParams.conclusion }),
        ...(searchParams.dateRange?.from && { startDate: searchParams.dateRange.from.toISOString() }),
        ...(searchParams.dateRange?.to && { endDate: searchParams.dateRange.to.toISOString() }),
      });

      const response = await fetch(`/api/quarantine-organizations/${organizationId}/results?${params}`);
      const result = await response.json();

      if (result.code === 200) {
        setResults(result.data.items);
        setPagination(prev => ({
          ...prev,
          total: result.data.total,
        }));
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
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
    setSearchParams({ conclusion: 'ALL' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const renderConclusion = (conclusion: QuarantineResult['conclusion']) => {
    const conclusionMap = {
      PASS: { label: '通过', color: 'bg-green-500', icon: CheckCircle2 },
      FAIL: { label: '未通过', color: 'bg-red-500', icon: AlertTriangle },
      NEED_PROCESS: { label: '需处理', color: 'bg-yellow-500', icon: FileText },
    };

    const { label, color, icon: Icon } = conclusionMap[conclusion];

    return (
      <div className="flex items-center space-x-2">
        <Icon className={cn("h-4 w-4", color.replace('bg-', 'text-'))} />
        <span>{label}</span>
      </div>
    );
  };

  const renderFindingType = (type: QuarantineResult['findings'][0]['type']) => {
    const typeMap = {
      PEST: { label: '有害生物', color: 'text-red-600 bg-red-50' },
      DISEASE: { label: '病害', color: 'text-purple-600 bg-purple-50' },
      WEED: { label: '杂草', color: 'text-yellow-600 bg-yellow-50' },
      OTHER: { label: '其他', color: 'text-blue-600 bg-blue-50' },
    };

    const { label, color } = typeMap[type];

    return (
      <Badge variant="outline" className={cn("font-medium", color)}>
        {label}
      </Badge>
    );
  };

  const renderFindingLevel = (level: QuarantineResult['findings'][0]['level']) => {
    const levelMap = {
      LOW: { label: '轻度', color: 'text-green-600 bg-green-50' },
      MEDIUM: { label: '中度', color: 'text-yellow-600 bg-yellow-50' },
      HIGH: { label: '重度', color: 'text-red-600 bg-red-50' },
    };

    const { label, color } = levelMap[level];

    return (
      <Badge variant="outline" className={cn("font-medium", color)}>
        {label}
      </Badge>
    );
  };

  const renderFindings = (findings: QuarantineResult['findings']) => {
    if (findings.length === 0) return <span className="text-muted-foreground">无发现</span>;

    return (
      <div className="space-y-2">
        {findings.map((finding, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 cursor-help">
                {renderFindingType(finding.type)}
                <span className="font-medium">{finding.name}</span>
                {renderFindingLevel(finding.level)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{finding.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  };

  const renderDetails = (result: QuarantineResult) => (
    <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>检疫结果详情</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">检疫结论</div>
              <div className="font-medium">{renderConclusion(result.conclusion)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">检疫人员</div>
              <div className="font-medium">{result.inspector.name}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">检疫日期</div>
              <div className="font-medium">{formatDate(result.inspectionDate)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">检疫对象</div>
            <div className="p-4 rounded-lg border space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">类型</span>
                <span>{result.subject.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">名称</span>
                <span>{result.subject.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">数量</span>
                <span>{result.subject.quantity} {result.subject.unit}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">检疫发现</div>
            <div className="p-4 rounded-lg border space-y-4">
              {result.findings.length === 0 ? (
                <div className="text-center text-muted-foreground">无发现</div>
              ) : (
                result.findings.map((finding, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {renderFindingType(finding.type)}
                        <span className="font-medium">{finding.name}</span>
                      </div>
                      {renderFindingLevel(finding.level)}
                    </div>
                    <p className="text-sm text-muted-foreground">{finding.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {result.processingMethod && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">处理方法</div>
              <div className="p-4 rounded-lg border">
                <p>{result.processingMethod}</p>
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
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>关键词搜索</Label>
          <Input
            placeholder="检疫对象/检疫员"
            value={searchParams.keyword}
            onChange={e => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>检疫结论</Label>
          <Select
            value={searchParams.conclusion}
            onValueChange={value => setSearchParams(prev => ({ ...prev, conclusion: value as QuarantineResult['conclusion'] | 'ALL' }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择结论" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部</SelectItem>
              <SelectItem value="PASS">通过</SelectItem>
              <SelectItem value="FAIL">未通过</SelectItem>
              <SelectItem value="NEED_PROCESS">需处理</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>检疫日期</Label>
          <DateRangePicker
            value={searchParams.dateRange}
            onValueChange={range => setSearchParams(prev => ({ ...prev, dateRange: range }))}
          />
        </div>
        <div className="flex items-end space-x-2 md:col-span-3">
          <Button onClick={handleSearch} disabled={loading}>搜索</Button>
          <Button variant="outline" onClick={handleReset} disabled={loading}>重置</Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>检疫对象</TableHead>
              <TableHead>检疫发现</TableHead>
              <TableHead>检疫结论</TableHead>
              <TableHead>检疫员</TableHead>
              <TableHead>检疫日期</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pagination.pageSize }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))
            ) : results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              results.map(result => (
                <TableRow key={result.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{result.subject.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.subject.quantity} {result.subject.unit}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{renderFindings(result.findings)}</TableCell>
                  <TableCell>{renderConclusion(result.conclusion)}</TableCell>
                  <TableCell>{result.inspector.name}</TableCell>
                  <TableCell>{formatDate(result.inspectionDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedResult(result)}
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
      {selectedResult && renderDetails(selectedResult)}
    </div>
  );
} 