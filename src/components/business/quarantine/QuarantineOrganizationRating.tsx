'use client';

import { useState } from 'react';
import { Star, StarHalf, StarOff, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Rating {
  id: string;
  score: number;
  level: 'A' | 'B' | 'C' | 'D';
  comment: string;
  evaluator: string;
  evaluateDate: string;
}

interface RatingHistory {
  id: string;
  oldScore: number;
  newScore: number;
  oldLevel: 'A' | 'B' | 'C' | 'D';
  newLevel: 'A' | 'B' | 'C' | 'D';
  reason: string;
  operator: string;
  operateDate: string;
}

interface QuarantineOrganizationRatingProps {
  organizationId: string;
  className?: string;
}

export function QuarantineOrganizationRating({
  organizationId,
  className,
}: QuarantineOrganizationRatingProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<Rating | null>(null);
  const [ratingHistory, setRatingHistory] = useState<RatingHistory[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [evaluateOpen, setEvaluateOpen] = useState(false);
  const [evaluateForm, setEvaluateForm] = useState({
    score: 5,
    level: 'A',
    comment: '',
  });

  const fetchRating = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quarantine-organizations/${organizationId}/rating`);
      const result = await response.json();

      if (result.code === 200) {
        setRating(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to fetch rating:', error);
      toast({
        title: '获取评级失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quarantine-organizations/${organizationId}/rating/history`);
      const result = await response.json();

      if (result.code === 200) {
        setRatingHistory(result.data.items);
        setHistoryOpen(true);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to fetch rating history:', error);
      toast({
        title: '获取评级历史失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quarantine-organizations/${organizationId}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluateForm),
      });

      const result = await response.json();
      if (result.code === 200) {
        toast({
          title: '评级成功',
          description: '机构评级已更新',
        });
        fetchRating();
        setEvaluateOpen(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to evaluate:', error);
      toast({
        title: '评级失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 !== 0;
    const emptyStars = 5 - Math.ceil(score);

    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star key={`full-${index}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        )}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <StarOff key={`empty-${index}`} className="h-5 w-5 text-muted-foreground" />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {score.toFixed(1)}
        </span>
      </div>
    );
  };

  const renderLevel = (level: Rating['level']) => {
    const levelMap = {
      A: { label: 'A级', color: 'bg-green-500' },
      B: { label: 'B级', color: 'bg-blue-500' },
      C: { label: 'C级', color: 'bg-yellow-500' },
      D: { label: 'D级', color: 'bg-red-500' },
    };

    const { label, color } = levelMap[level];

    return (
      <div className="flex items-center space-x-2">
        <div className={cn("h-2 w-2 rounded-full", color)} />
        <span>{label}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* 评级信息 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-sm font-medium">当前评级</div>
          {rating ? (
            <>
              {renderStars(rating.score)}
              <div className="mt-2">{renderLevel(rating.level)}</div>
            </>
          ) : (
            <div className="text-muted-foreground">暂无评级</div>
          )}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchRatingHistory()}
          >
            <History className="mr-2 h-4 w-4" />
            评级历史
          </Button>
          <Button
            size="sm"
            onClick={() => setEvaluateOpen(true)}
          >
            评级
          </Button>
        </div>
      </div>

      {rating && (
        <div className="rounded-lg border p-4 space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">评级说明</div>
            <div className="text-sm text-muted-foreground">
              {rating.comment}
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <div>评级人：{rating.evaluator}</div>
            <div>评级时间：{formatDate(rating.evaluateDate)}</div>
          </div>
        </div>
      )}

      {/* 评级历史对话框 */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>评级历史</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {ratingHistory.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  暂无评级历史
                </div>
              ) : (
                ratingHistory.map(history => (
                  <div
                    key={history.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {renderStars(history.oldScore)}
                          {renderLevel(history.oldLevel)}
                        </div>
                        <div className="text-muted-foreground">→</div>
                        <div className="flex items-center space-x-2">
                          {renderStars(history.newScore)}
                          {renderLevel(history.newLevel)}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {history.reason}
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div>操作人：{history.operator}</div>
                        <div>操作时间：{formatDate(history.operateDate)}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* 评级对话框 */}
      <Dialog open={evaluateOpen} onOpenChange={setEvaluateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>机构评级</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>评级分数</Label>
              <Select
                value={String(evaluateForm.score)}
                onValueChange={value => setEvaluateForm(prev => ({ ...prev, score: Number(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择分数" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 9 }, (_, i) => i + 1).map(score => (
                    <SelectItem key={score} value={String(score)}>
                      {score} 分
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>评级等级</Label>
              <Select
                value={evaluateForm.level}
                onValueChange={value => setEvaluateForm(prev => ({ ...prev, level: value as Rating['level'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A级</SelectItem>
                  <SelectItem value="B">B级</SelectItem>
                  <SelectItem value="C">C级</SelectItem>
                  <SelectItem value="D">D级</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>评级说明</Label>
              <Textarea
                value={evaluateForm.comment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEvaluateForm(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="请输入评级说明"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEvaluateOpen(false)}
            >
              取消
            </Button>
            <Button
              onClick={handleEvaluate}
              disabled={loading}
            >
              {loading ? '提交中...' : '确定'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 