'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, QrCode, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  enterpriseId: z.string().min(1, '请选择引种企业'),
  plantChineseName: z.string().min(1, '请输入植物中文名称'),
  plantScientificName: z.string().min(1, '请输入植物学名'),
  variety: z.string().min(1, '请输入品种名称'),
  part: z.string().min(1, '请选择植物部位'),
  sourceCountry: z.string().min(1, '请选择来源国'),
  entryPort: z.string().min(1, '请选择入境口岸'),
  entryQuantity: z.number().min(1, '请输入入境数量'),
  sampleQuantity: z.number().min(1, '请输入送检数量'),
  packageMaterial: z.string().min(1, '请选择包装材料'),
  approvalNo: z.string().min(1, '请输入审批号'),
  quarantineCertNo: z.string().min(1, '请输入检疫证书号'),
  releaseNoticeNo: z.string().min(1, '请输入放行通知单号'),
  remarks: z.string().optional(),
});

interface IsolationSampleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IsolationSampleForm({ open, onOpenChange }: IsolationSampleFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      remarks: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      // 模拟提交
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(values);
      toast({
        title: '提交成功',
        description: '样品信息已登记',
      });
      onOpenChange(false);
      form.reset();
      setStep(1);
    } catch (error) {
      console.error('Failed to submit:', error);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>样品登记</DialogTitle>
          <DialogDescription>
            请填写样品基本信息，带 * 号的为必填项
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <nav aria-label="Progress" className="mb-6">
            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
              {[
                { name: '基本信息', step: 1 },
                { name: '植物信息', step: 2 },
                { name: '单据信息', step: 3 },
              ].map((item) => (
                <li key={item.name} className="md:flex-1">
                  <div
                    className={cn(
                      "flex flex-col border rounded-lg py-2 px-4 text-sm md:pl-4 md:pr-6 cursor-pointer",
                      step === item.step
                        ? "border-primary bg-primary/5"
                        : step > item.step
                        ? "border-muted-foreground/30"
                        : "border-muted"
                    )}
                    onClick={() => setStep(item.step)}
                  >
                    <span className="text-xs font-medium text-muted-foreground">
                      步骤 {item.step}
                    </span>
                    <span className={cn(
                      "font-medium",
                      step === item.step
                        ? "text-primary"
                        : step > item.step
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60"
                    )}>
                      {item.name}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="enterpriseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>引种企业 *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择引种企业" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">示例企业A</SelectItem>
                            <SelectItem value="2">示例企业B</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center space-x-4">
                    <Button variant="outline" type="button">
                      <QrCode className="mr-2 h-4 w-4" />
                      扫描企业二维码
                    </Button>
                    <Button variant="outline" type="button">
                      <Upload className="mr-2 h-4 w-4" />
                      导入企业信息
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-2">
                    <FormField
                      control={form.control}
                      name="plantChineseName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>植物中文名称 *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="plantScientificName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>植物学名 *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="variety"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>品种名称 *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="part"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>植物部位 *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="选择植物部位" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="seed">种子</SelectItem>
                              <SelectItem value="seedling">幼苗</SelectItem>
                              <SelectItem value="fruit">果实</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    <FormField
                      control={form.control}
                      name="sourceCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>来源国 *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="选择来源国" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="JP">日本</SelectItem>
                              <SelectItem value="US">美国</SelectItem>
                              <SelectItem value="NL">荷兰</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="entryPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>入境口岸 *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="选择入境口岸" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PVG">上海浦东</SelectItem>
                              <SelectItem value="PEK">北京首都</SelectItem>
                              <SelectItem value="CAN">广州白云</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    <FormField
                      control={form.control}
                      name="entryQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>入境数量 *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sampleQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>送检数量 *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="packageMaterial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>包装材料 *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择包装材料" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="paper">纸质包装</SelectItem>
                            <SelectItem value="plastic">塑料包装</SelectItem>
                            <SelectItem value="wood">木质包装</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="approvalNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>审批号 *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quarantineCertNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>检疫证书号 *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="releaseNoticeNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>放行通知单号 *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>备注</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="请输入备注信息"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <DialogFooter>
                <div className="flex justify-between w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (step > 1) {
                        setStep(step - 1);
                      } else {
                        onOpenChange(false);
                      }
                    }}
                  >
                    {step === 1 ? '取消' : '上一步'}
                  </Button>
                  <Button
                    type={step === 3 ? 'submit' : 'button'}
                    onClick={() => {
                      if (step < 3) {
                        setStep(step + 1);
                      }
                    }}
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {step === 3 ? '提交' : '下一步'}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 