'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Printer, Send, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  disabled?: boolean;
}

export function IsolationQuarantineProcess() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeType, setNoticeType] = useState('');
  const [noticeNo, setNoticeNo] = useState('');
  const [noticeContent, setNoticeContent] = useState('');

  const steps: ProcessStep[] = [
    {
      id: 'notice',
      title: '处理通知',
      description: '生成并发送处理通知书',
      icon: <FileText className="h-5 w-5 text-primary" />,
      action: '生成通知',
    },
    {
      id: 'print',
      title: '打印文书',
      description: '打印处理相关文书',
      icon: <Printer className="h-5 w-5 text-primary" />,
      action: '打印文书',
      disabled: !noticeNo,
    },
    {
      id: 'send',
      title: '发送通知',
      description: '发送处理通知给相关方',
      icon: <Send className="h-5 w-5 text-primary" />,
      action: '发送通知',
      disabled: !noticeNo,
    },
    {
      id: 'confirm',
      title: '确认送达',
      description: '确认通知已送达并回执',
      icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
      action: '确认送达',
      disabled: !noticeNo,
    },
  ];

  const handleStepAction = async (step: ProcessStep) => {
    if (step.disabled) {
      toast({
        title: '请先完成前序步骤',
        variant: 'destructive',
      });
      return;
    }

    switch (step.id) {
      case 'notice':
        setNoticeOpen(true);
        break;
      case 'print':
        toast({
          title: '正在打印',
          description: '文书正在发送到打印机',
        });
        break;
      case 'send':
        toast({
          title: '发送成功',
          description: '通知已发送至相关方',
        });
        break;
      case 'confirm':
        toast({
          title: '确认成功',
          description: '已记录送达确认',
        });
        break;
      default:
        break;
    }
  };

  const handleNoticeSubmit = async () => {
    if (!noticeType || !noticeContent) {
      toast({
        title: '请填写完整信息',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      // 模拟提交通知
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNoticeNo(`NT${Date.now().toString().slice(-8)}`);
      toast({
        title: '生成成功',
        description: '处理通知书已生成',
      });
      setNoticeOpen(false);
    } catch (error) {
      console.error('Failed to generate notice:', error);
      toast({
        title: '生成失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">处理流程</h3>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex items-center justify-between p-4 rounded-lg border"
          >
            <div className="flex items-center space-x-4">
              <div className="rounded-lg bg-primary/10 p-2">
                {step.icon}
              </div>
              <div>
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStepAction(step)}
              disabled={step.disabled}
            >
              {step.action}
            </Button>
          </div>
        ))}
      </div>

      {/* 通知生成对话框 */}
      <Dialog open={noticeOpen} onOpenChange={setNoticeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>生成处理通知</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>通知类型</Label>
              <Select
                value={noticeType}
                onValueChange={setNoticeType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择通知类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="destroy">销毁通知</SelectItem>
                  <SelectItem value="process">处理通知</SelectItem>
                  <SelectItem value="recheck">复检通知</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {noticeNo && (
              <div className="space-y-2">
                <Label>通知书编号</Label>
                <Input value={noticeNo} disabled />
              </div>
            )}
            <div className="space-y-2">
              <Label>通知内容</Label>
              <Textarea
                placeholder="请输入通知内容..."
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                rows={6}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setNoticeOpen(false)}
              >
                取消
              </Button>
              <Button
                onClick={handleNoticeSubmit}
                disabled={loading}
              >
                生成通知
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 