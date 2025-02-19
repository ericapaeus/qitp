'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Search, Filter } from 'lucide-react';
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

interface IsolationSample {
  id: string;
  registrationNo: string;
  enterpriseName: string;
  plantName: string;
  variety: string;
  sourceCountry: string;
  sampleQuantity: number;
  registrationDate: string;
  status: 'PENDING' | 'EXAMINING' | 'COMPLETED' | 'REJECTED';
}

interface IsolationSampleListProps {
  status: string;
  onRegister: () => void;
}

const mockData: IsolationSample[] = [
  {
    id: '1',
    registrationNo: 'SMP20240301001',
    enterpriseName: '示例企业A',
    plantName: '水稻',
    variety: '品种A',
    sourceCountry: '日本',
    sampleQuantity: 100,
    registrationDate: '2024-03-01',
    status: 'PENDING',
  },
  // ... 更多模拟数据
];

const statusMap = {
  PENDING: { label: '待接收', color: 'default' },
  EXAMINING: { label: '初检中', color: 'warning' },
  COMPLETED: { label: '已完成', color: 'success' },
  REJECTED: { label: '已退回', color: 'destructive' },
} as const;

export function IsolationSampleList({ status, onRegister }: IsolationSampleListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredData = mockData.filter(item => 
    item.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.enterpriseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.plantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索登记号/企业/植物"
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
              <DropdownMenuItem>按数量排序</DropdownMenuItem>
              <DropdownMenuItem>按企业筛选</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={onRegister}>
          <Plus className="mr-2 h-4 w-4" />
          登记新样品
        </Button>
      </div>

      <ScrollArea className="h-[500px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>登记号</TableHead>
              <TableHead>企业名称</TableHead>
              <TableHead>植物名称</TableHead>
              <TableHead>品种</TableHead>
              <TableHead>来源国</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>登记日期</TableHead>
              <TableHead>状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((sample) => (
              <TableRow key={sample.id}>
                <TableCell className="font-medium">{sample.registrationNo}</TableCell>
                <TableCell>{sample.enterpriseName}</TableCell>
                <TableCell>{sample.plantName}</TableCell>
                <TableCell>{sample.variety}</TableCell>
                <TableCell>{sample.sourceCountry}</TableCell>
                <TableCell>{sample.sampleQuantity}</TableCell>
                <TableCell>{sample.registrationDate}</TableCell>
                <TableCell>
                  <Badge variant={statusMap[sample.status].color as any}>
                    {statusMap[sample.status].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
} 