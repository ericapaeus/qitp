'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/utils';

interface QuarantineOrganizationExportProps {
  searchParams?: Record<string, any>;
  className?: string;
}

export function QuarantineOrganizationExport({
  searchParams,
  className,
}: QuarantineOrganizationExportProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(searchParams || {}),
        export: 'true',
      });

      const response = await fetch(`/api/quarantine-organizations?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `检疫机构列表_${formatDate(new Date(), 'YYYY-MM-DD')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: '导出成功',
        description: '文件已开始下载',
      });
    } catch (error) {
      console.error('Failed to export:', error);
      toast({
        title: '导出失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={loading}
      className={className}
    >
      <Download className="mr-2 h-4 w-4" />
      {loading ? '导出中...' : '导出'}
    </Button>
  );
} 