'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FileText, FileDown, FileCheck, Share2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'PROCESS' | 'RESULT' | 'SUMMARY';
}

export function IsolationQuarantineReport() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generatedReport, setGeneratedReport] = useState<string>('');

  const templates: ReportTemplate[] = [
    {
      id: 'process',
      title: '处理过程报告',
      description: '记录检疫处理的详细过程',
      icon: <FileText className="h-5 w-5 text-primary" />,
      type: 'PROCESS',
    },
    {
      id: 'result',
      title: '处理结果报告',
      description: '记录检疫处理的最终结果',
      icon: <FileCheck className="h-5 w-5 text-primary" />,
      type: 'RESULT',
    },
    {
      id: 'summary',
      title: '汇总报告',
      description: '汇总多个样品的处理情况',
      icon: <Share2 className="h-5 w-5 text-primary" />,
      type: 'SUMMARY',
    },
  ];

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      toast({
        title: '请选择报告模板',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      // 模拟生成报告
      await new Promise(resolve => setTimeout(resolve, 1500));
      const reportNo = `RPT${Date.now().toString().slice(-8)}`;
      setGeneratedReport(reportNo);
      toast({
        title: '生成成功',
        description: '报告已生成',
      });
      setTemplateOpen(false);
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({
        title: '生成失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportNo: string) => {
    try {
      setLoading(true);
      // 模拟下载报告
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: '下载成功',
        description: '报告已开始下载',
      });
    } catch (error) {
      console.error('Failed to download report:', error);
      toast({
        title: '下载失败',
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
        <h3 className="font-semibold">报告生成</h3>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setTemplateOpen(true)}
        >
          <FileText className="mr-2 h-4 w-4" />
          生成新报告
        </Button>

        {generatedReport && (
          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">最近生成的报告</h4>
                <p className="text-sm text-muted-foreground">
                  报告编号：{generatedReport}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(generatedReport)}
                disabled={loading}
              >
                <FileDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 模板选择对话框 */}
      <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>选择报告模板</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors",
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  )}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      {template.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{template.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setTemplateOpen(false)}
              >
                取消
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={loading || !selectedTemplate}
              >
                生成报告
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 