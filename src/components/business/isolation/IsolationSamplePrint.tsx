'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Printer, QrCode, Copy, CheckCircle2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PrintPreview {
  registrationNo: string;
  plantName: string;
  variety: string;
  sampleQuantity: string;
  date: string;
}

export function IsolationSamplePrint() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<PrintPreview | null>(null);
  const [printerType, setPrinterType] = useState('');

  const handlePreview = () => {
    // 模拟获取打印预览数据
    setPreview({
      registrationNo: 'SMP20240301001',
      plantName: '水稻',
      variety: '品种A',
      sampleQuantity: '100株',
      date: '2024-03-01',
    });
  };

  const handlePrint = async () => {
    if (!printerType) {
      toast({
        title: '请选择打印机',
        description: '需要选择打印机才能继续',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      // 模拟打印过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: '打印成功',
        description: '标签已发送到打印机',
      });
    } catch (error) {
      console.error('Failed to print:', error);
      toast({
        title: '打印失败',
        description: '请检查打印机连接并重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">标签打印</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>打印机选择</Label>
            <Select value={printerType} onValueChange={setPrinterType}>
              <SelectTrigger>
                <SelectValue placeholder="选择打印机" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="printer1">标签打印机 - 1号</SelectItem>
                <SelectItem value="printer2">标签打印机 - 2号</SelectItem>
                <SelectItem value="printer3">标签打印机 - 3号</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>登记号</Label>
            <div className="flex space-x-2">
              <Input placeholder="输入或扫描登记号" />
              <Button variant="outline" size="icon" onClick={handlePreview}>
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {preview && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">打印预览</div>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">登记号：</span>
                    <span>{preview.registrationNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">植物名称：</span>
                    <span>{preview.plantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">品种：</span>
                    <span>{preview.variety}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">数量：</span>
                    <span>{preview.sampleQuantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">日期：</span>
                    <span>{preview.date}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handlePrint}
                disabled={loading}
              >
                <Printer className="mr-2 h-4 w-4" />
                {loading ? '打印中...' : '打印标签'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">快捷操作</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="#">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              批量打印标签
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="#">
              <QrCode className="mr-2 h-4 w-4" />
              扫描登记号
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
} 