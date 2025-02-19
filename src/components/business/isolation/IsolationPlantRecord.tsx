'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FileEdit, Camera, AlertTriangle, Ruler, Microscope, Leaf } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QuickRecordFormProps {
  type: 'growth' | 'measure' | 'observation' | 'abnormal';
  onClose: () => void;
  onSubmit: () => Promise<void>;
}

function QuickRecordForm({ type, onClose, onSubmit }: QuickRecordFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmit();
      onClose();
    } catch (error) {
      console.error('Failed to submit record:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (type) {
      case 'growth':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>生长状态</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择生长状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">正常生长</SelectItem>
                  <SelectItem value="fast">生长迅速</SelectItem>
                  <SelectItem value="slow">生长缓慢</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>记录内容</Label>
              <Textarea
                placeholder="请输入生长记录内容..."
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit" disabled={loading}>
                {loading ? '提交中...' : '提交'}
              </Button>
            </div>
          </form>
        );
      case 'measure':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>株高 (cm)</Label>
                <Input type="number" step="0.1" />
              </div>
              <div className="space-y-2">
                <Label>叶片数量</Label>
                <Input type="number" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>备注</Label>
              <Textarea
                placeholder="请输入测量备注..."
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit" disabled={loading}>
                {loading ? '提交中...' : '提交'}
              </Button>
            </div>
          </form>
        );
      case 'observation':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>观察项目</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择观察项目" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leaf">叶片观察</SelectItem>
                  <SelectItem value="root">根系观察</SelectItem>
                  <SelectItem value="flower">花部观察</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>观察记录</Label>
              <Textarea
                placeholder="请输入观察记录内容..."
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit" disabled={loading}>
                {loading ? '提交中...' : '提交'}
              </Button>
            </div>
          </form>
        );
      case 'abnormal':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>异常类型</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择异常类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disease">病害</SelectItem>
                  <SelectItem value="pest">虫害</SelectItem>
                  <SelectItem value="growth">生长异常</SelectItem>
                  <SelectItem value="other">其他异常</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>异常描述</Label>
              <Textarea
                placeholder="请详细描述异常情况..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>处理建议</Label>
              <Textarea
                placeholder="请输入处理建议..."
                rows={2}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit" disabled={loading}>
                {loading ? '提交中...' : '提交'}
              </Button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'growth' && '生长记录'}
            {type === 'measure' && '测量记录'}
            {type === 'observation' && '观察记录'}
            {type === 'abnormal' && '异常记录'}
          </DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
}

export function IsolationPlantRecord() {
  const { toast } = useToast();
  const [recordType, setRecordType] = useState<'growth' | 'measure' | 'observation' | 'abnormal' | null>(null);

  const handleSubmit = async () => {
    try {
      // 模拟提交记录
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: '记录成功',
        description: '记录已保存',
      });
    } catch (error) {
      console.error('Failed to save record:', error);
      toast({
        title: '记录失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">快捷记录</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-auto py-4 px-4"
          onClick={() => setRecordType('growth')}
        >
          <div className="flex flex-col items-center space-y-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span>生长记录</span>
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 px-4"
          onClick={() => setRecordType('measure')}
        >
          <div className="flex flex-col items-center space-y-2">
            <Ruler className="h-5 w-5 text-primary" />
            <span>测量记录</span>
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 px-4"
          onClick={() => setRecordType('observation')}
        >
          <div className="flex flex-col items-center space-y-2">
            <Microscope className="h-5 w-5 text-primary" />
            <span>观察记录</span>
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 px-4"
          onClick={() => setRecordType('abnormal')}
        >
          <div className="flex flex-col items-center space-y-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <span>异常记录</span>
          </div>
        </Button>
      </div>

      {recordType && (
        <QuickRecordForm
          type={recordType}
          onClose={() => setRecordType(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
} 