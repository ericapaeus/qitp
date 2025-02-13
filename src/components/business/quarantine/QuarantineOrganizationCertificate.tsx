'use client';

import { useState } from 'react';
import { FileText, Upload, Download, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Certificate {
  id: string;
  type: 'QUALIFICATION' | 'LICENSE' | 'APPROVAL';
  name: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  status: 'VALID' | 'EXPIRED' | 'REVOKED';
  fileUrl: string;
}

interface QuarantineOrganizationCertificateProps {
  organizationId: string;
  className?: string;
}

export function QuarantineOrganizationCertificate({
  organizationId,
  className,
}: QuarantineOrganizationCertificateProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quarantine-organizations/${organizationId}/certificates`);
      const result = await response.json();

      if (result.code === 200) {
        setCertificates(result.data.items);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      toast({
        title: '获取证书失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/quarantine-organizations/${organizationId}/certificates/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.code === 200) {
        toast({
          title: '上传成功',
          description: '证书已上传',
        });
        fetchCertificates();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to upload certificate:', error);
      toast({
        title: '上传失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/quarantine-organizations/${organizationId}/certificates/${deleteId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.code === 200) {
        toast({
          title: '删除成功',
          description: '证书已删除',
        });
        fetchCertificates();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to delete certificate:', error);
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

  const handleDownload = async (certificate: Certificate) => {
    try {
      setLoading(true);
      const response = await fetch(certificate.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificate.name}_${certificate.number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: '下载成功',
        description: '文件已开始下载',
      });
    } catch (error) {
      console.error('Failed to download certificate:', error);
      toast({
        title: '下载失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status: Certificate['status']) => {
    const statusMap = {
      VALID: { label: '有效', color: 'bg-green-500' },
      EXPIRED: { label: '已过期', color: 'bg-yellow-500' },
      REVOKED: { label: '已吊销', color: 'bg-red-500' },
    };

    const { label, color } = statusMap[status];

    return (
      <div className="flex items-center space-x-2">
        <div className={cn("h-2 w-2 rounded-full", color)} />
        <span>{label}</span>
      </div>
    );
  };

  const renderType = (type: Certificate['type']) => {
    const typeMap = {
      QUALIFICATION: '资质证书',
      LICENSE: '许可证书',
      APPROVAL: '批准文件',
    };

    return typeMap[type];
  };

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* 上传按钮 */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="relative">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleUpload}
            disabled={loading}
          />
          <Upload className="mr-2 h-4 w-4" />
          上传证书
        </Button>
      </div>

      {/* 证书列表 */}
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              暂无证书记录
            </div>
          ) : (
            certificates.map(certificate => (
              <div
                key={certificate.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{certificate.name}</span>
                    <Badge variant="outline">
                      {renderType(certificate.type)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    证书编号：{certificate.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    有效期：{formatDate(certificate.issueDate)} ~ {formatDate(certificate.expiryDate)}
                  </div>
                  <div>{renderStatus(certificate.status)}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPreviewUrl(certificate.fileUrl)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>预览</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(certificate)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>下载</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(certificate.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>删除</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除该证书，是否继续？
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

      {/* 预览对话框 */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>证书预览</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[60vh]">
            <iframe
              src={previewUrl || ''}
              className="absolute inset-0 w-full h-full"
              title="证书预览"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 