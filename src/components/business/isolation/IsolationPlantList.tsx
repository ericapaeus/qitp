'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Camera, FileEdit } from 'lucide-react';
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
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface IsolationPlant {
  id: string;
  sampleNo: string;
  plantName: string;
  variety: string;
  startDate: string;
  growthStatus: string;
  lastCheckDate: string;
  nextCheckDate: string;
  status: 'ONGOING' | 'OBSERVATION' | 'COMPLETED' | 'ABNORMAL';
}

interface IsolationPlantListProps {
  status: string;
}

const mockData: IsolationPlant[] = [
  {
    id: '1',
    sampleNo: 'PLT20240301001',
    plantName: '水稻',
    variety: '品种A',
    startDate: '2024-03-01',
    growthStatus: '正常生长，株高30cm',
    lastCheckDate: '2024-03-15',
    nextCheckDate: '2024-03-22',
    status: 'ONGOING',
  },
  // ... 更多模拟数据
];

const statusMap = {
  ONGOING: { label: '试种中', color: 'default' },
  OBSERVATION: { label: '观察期', color: 'warning' },
  COMPLETED: { label: '已完成', color: 'success' },
  ABNORMAL: { label: '异常', color: 'destructive' },
} as const;

export function IsolationPlantList({ status }: IsolationPlantListProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<IsolationPlant | null>(null);
  const [recordOpen, setRecordOpen] = useState(false);
  const [recordContent, setRecordContent] = useState('');

  const filteredData = mockData.filter(item => 
    item.sampleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.plantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.variety.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecord = async () => {
    if (!recordContent) {
      toast({
        title: '请输入记录内容',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      // 模拟提交记录
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: '记录成功',
        description: '生长记录已保存',
      });
      setRecordOpen(false);
      setRecordContent('');
    } catch (error) {
      console.error('Failed to save record:', error);
      toast({
        title: '记录失败',
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
              <DropdownMenuItem>按生长状态筛选</DropdownMenuItem>
              <DropdownMenuItem>按检查日期筛选</DropdownMenuItem>
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
              <TableHead>开始日期</TableHead>
              <TableHead>生长状态</TableHead>
              <TableHead>上次检查</TableHead>
              <TableHead>下次检查</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((plant) => (
              <TableRow key={plant.id}>
                <TableCell className="font-medium">{plant.sampleNo}</TableCell>
                <TableCell>{plant.plantName}</TableCell>
                <TableCell>{plant.variety}</TableCell>
                <TableCell>{plant.startDate}</TableCell>
                <TableCell>{plant.growthStatus}</TableCell>
                <TableCell>{plant.lastCheckDate}</TableCell>
                <TableCell>{plant.nextCheckDate}</TableCell>
                <TableCell>
                  <Badge variant={statusMap[plant.status].color as any}>
                    {statusMap[plant.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedPlant(plant);
                        setRecordOpen(true);
                      }}
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: '功能开发中',
                          description: '照片上传功能即将上线',
                        });
                      }}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* 记录对话框 */}
      <Dialog open={recordOpen} onOpenChange={setRecordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>生长记录</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>样品信息</Label>
              <div className="rounded-lg border p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">编号：</span>
                    <span>{selectedPlant?.sampleNo}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">植物：</span>
                    <span>{selectedPlant?.plantName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">品种：</span>
                    <span>{selectedPlant?.variety}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">状态：</span>
                    <Badge variant={statusMap[selectedPlant?.status || 'ONGOING'].color as any}>
                      {statusMap[selectedPlant?.status || 'ONGOING'].label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>记录内容</Label>
              <Textarea
                placeholder="请输入生长记录内容..."
                value={recordContent}
                onChange={(e) => setRecordContent(e.target.value)}
                rows={6}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setRecordOpen(false)}
              >
                取消
              </Button>
              <Button
                onClick={handleRecord}
                disabled={loading}
              >
                保存记录
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 