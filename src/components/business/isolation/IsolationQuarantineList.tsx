'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, FileText, ClipboardCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface QuarantineItem {
  id: string;
  sampleNo: string;
  plantName: string;
  variety: string;
  findings: Array<{
    type: 'PEST' | 'DISEASE' | 'WEED' | 'OTHER';
    name: string;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
  processingMethod?: 'DESTROY' | 'STERILIZE' | 'DETOXIFY';
  processingDate?: string;
  processingResult?: string;
  status: 'PENDING' | 'PROCESSING' | 'RECHECK' | 'COMPLETED';
}

interface IsolationQuarantineListProps {
  status: string;
}

const mockData: QuarantineItem[] = [
  {
    id: '1',
    sampleNo: 'QRT20240301001',
    plantName: '水稻',
    variety: '品种A',
    findings: [
      {
        type: 'PEST',
        name: '稻飞虱',
        level: 'HIGH',
      },
      {
        type: 'DISEASE',
        name: '稻瘟病',
        level: 'MEDIUM',
      },
    ],
    status: 'PENDING',
  },
  // ... 更多模拟数据
];

const statusMap = {
  PENDING: { label: '待处理', color: 'default' },
  PROCESSING: { label: '处理中', color: 'warning' },
  RECHECK: { label: '待复检', color: 'warning' },
  COMPLETED: { label: '已完成', color: 'success' },
} as const;

const findingTypeMap = {
  PEST: { label: '有害生物', color: 'text-red-600 bg-red-50' },
  DISEASE: { label: '病害', color: 'text-purple-600 bg-purple-50' },
  WEED: { label: '杂草', color: 'text-yellow-600 bg-yellow-50' },
  OTHER: { label: '其他', color: 'text-blue-600 bg-blue-50' },
} as const;

const findingLevelMap = {
  LOW: { label: '轻度', color: 'text-green-600 bg-green-50' },
  MEDIUM: { label: '中度', color: 'text-yellow-600 bg-yellow-50' },
  HIGH: { label: '重度', color: 'text-red-600 bg-red-50' },
} as const;

export function IsolationQuarantineList({ status }: IsolationQuarantineListProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<QuarantineItem | null>(null);
  const [processOpen, setProcessOpen] = useState(false);
  const [processMethod, setProcessMethod] = useState<QuarantineItem['processingMethod']>();
  const [processResult, setProcessResult] = useState('');

  const filteredData = mockData.filter(item => 
    item.sampleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.plantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.variety.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProcess = async () => {
    if (!processMethod) {
      toast({
        title: '请选择处理方式',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      // 模拟提交处理
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: '提交成功',
        description: '处理方案已保存',
      });
      setProcessOpen(false);
      setProcessMethod(undefined);
      setProcessResult('');
    } catch (error) {
      console.error('Failed to save process:', error);
      toast({
        title: '提交失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索编号/植物/品种"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>按日期排序</DropdownMenuItem>
              <DropdownMenuItem>按发现问题筛选</DropdownMenuItem>
              <DropdownMenuItem>按处理方式筛选</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="h-[600px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>样品编号</TableHead>
              <TableHead>植物名称</TableHead>
              <TableHead>品种</TableHead>
              <TableHead>发现问题</TableHead>
              <TableHead>处理方式</TableHead>
              <TableHead>处理结果</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.sampleNo}</TableCell>
                <TableCell>{item.plantName}</TableCell>
                <TableCell>{item.variety}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {item.findings.map((finding, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Badge variant="outline" className={findingTypeMap[finding.type].color}>
                          {findingTypeMap[finding.type].label}
                        </Badge>
                        <span className="text-sm">{finding.name}</span>
                        <Badge variant="outline" className={findingLevelMap[finding.level].color}>
                          {findingLevelMap[finding.level].label}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {item.processingMethod ? (
                    <Badge variant="outline">
                      {{
                        DESTROY: '销毁',
                        STERILIZE: '除害处理',
                        DETOXIFY: '消毒处理',
                      }[item.processingMethod]}
                    </Badge>
                  ) : (
                    '未处理'
                  )}
                </TableCell>
                <TableCell>
                  {item.processingResult || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={statusMap[item.status].color as any}>
                    {statusMap[item.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedItem(item);
                        setProcessOpen(true);
                      }}
                    >
                      <ClipboardCheck className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: '功能开发中',
                          description: '报告生成功能即将上线',
                        });
                      }}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* 处理对话框 */}
      <Dialog open={processOpen} onOpenChange={setProcessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>检疫处理</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>样品信息</Label>
              <div className="rounded-lg border p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">编号：</span>
                    <span>{selectedItem?.sampleNo}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">植物：</span>
                    <span>{selectedItem?.plantName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">品种：</span>
                    <span>{selectedItem?.variety}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">状态：</span>
                    <Badge variant={statusMap[selectedItem?.status || 'PENDING'].color as any}>
                      {statusMap[selectedItem?.status || 'PENDING'].label}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-muted-foreground">发现问题：</span>
                  <div className="mt-1 space-y-1">
                    {selectedItem?.findings.map((finding, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Badge variant="outline" className={findingTypeMap[finding.type].color}>
                          {findingTypeMap[finding.type].label}
                        </Badge>
                        <span className="text-sm">{finding.name}</span>
                        <Badge variant="outline" className={findingLevelMap[finding.level].color}>
                          {findingLevelMap[finding.level].label}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>处理方式</Label>
              <Select
                value={processMethod}
                onValueChange={(value) => setProcessMethod(value as QuarantineItem['processingMethod'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择处理方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DESTROY">销毁</SelectItem>
                  <SelectItem value="STERILIZE">除害处理</SelectItem>
                  <SelectItem value="DETOXIFY">消毒处理</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>处理结果</Label>
              <Textarea
                placeholder="请输入处理结果..."
                value={processResult}
                onChange={(e) => setProcessResult(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setProcessOpen(false)}
              >
                取消
              </Button>
              <Button
                onClick={handleProcess}
                disabled={loading}
              >
                提交处理
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 