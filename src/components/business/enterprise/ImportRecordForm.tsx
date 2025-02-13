'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// 表单验证规则
const formSchema = z.object({
  // 基本信息
  approvalNo: z
    .string()
    .min(1, '请输入审批编号')
    .max(50, '审批编号不能超过50个字符')
    .regex(/^[A-Za-z0-9-]+$/, '审批编号只能包含字母、数字和连字符'),
  enterpriseId: z.string().min(1, '请选择企业'),
  
  // 植物信息
  plant: z.object({
    name: z.string().min(1, '请输入植物名称'),
    scientificName: z.string().min(1, '请输入学名'),
    variety: z.string().min(1, '请输入品种'),
    sourceCountry: z.string().min(1, '请选择来源国'),
    quantity: z.number().min(0.01, '请输入数量'),
    unit: z.string().min(1, '请选择单位'),
    purpose: z.string().min(1, '请选择用途'),
  }),

  // 引进信息
  importInfo: z.object({
    entryPort: z.string().min(1, '请选择入境口岸'),
    plannedDate: z.string().min(1, '请选择计划引进日期'),
    actualDate: z.string().optional(),
  }),

  // 隔离信息（可选）
  isolationInfo: z.object({
    facilityId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }).optional(),

  status: z.enum(['PENDING', 'IMPORTING', 'ISOLATING', 'COMPLETED']),
});

export type FormValues = z.infer<typeof formSchema>;

interface ImportRecordFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: FormValues;
  onSubmit: (values: FormValues) => Promise<void>;
  loading?: boolean;
}

export function ImportRecordForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  loading = false,
}: ImportRecordFormProps) {
  const [activeTab, setActiveTab] = React.useState('basic');
  const [enterprises, setEnterprises] = React.useState([
    { id: '1', name: '示例企业1' },
    { id: '2', name: '示例企业2' },
  ]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      status: 'PENDING',
      plant: {
        quantity: 0,
      },
      importInfo: {},
      isolationInfo: {},
    } as any,
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [form, initialData]);

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? '编辑引种记录' : '新增引种记录'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="plant">植物信息</TabsTrigger>
                <TabsTrigger value="import">引进信息</TabsTrigger>
              </TabsList>

              {/* 基本信息 */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="approvalNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>审批编号</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="请输入审批编号" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="enterpriseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>企业名称</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="请选择企业" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {enterprises.map(enterprise => (
                              <SelectItem key={enterprise.id} value={enterprise.id}>
                                {enterprise.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* 植物信息 */}
              <TabsContent value="plant" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="plant.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>植物名称</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="请输入植物名称" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plant.scientificName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>学名</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="请输入学名" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plant.variety"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>品种</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="请输入品种" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plant.sourceCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>来源国</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="请选择来源国" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {['美国', '加拿大', '澳大利亚', '法国'].map(country => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plant.quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>数量</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0.01"
                            step="0.01"
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            placeholder="请输入数量"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plant.unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>单位</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="请选择单位" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {['kg', 'g', '株'].map(unit => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plant.purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>用途</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="请选择用途" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {['科研', '生产', '育种'].map(purpose => (
                              <SelectItem key={purpose} value={purpose}>
                                {purpose}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* 引进信息 */}
              <TabsContent value="import" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="importInfo.entryPort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>入境口岸</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="请选择入境口岸" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {['青岛港', '天津港', '上海港', '广州港'].map(port => (
                              <SelectItem key={port} value={port}>
                                {port}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="importInfo.plannedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>计划引进日期</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {initialData && (
                    <>
                      <FormField
                        control={form.control}
                        name="importInfo.actualDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>实际引进日期</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>状态</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="请选择状态" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="PENDING">待引进</SelectItem>
                                <SelectItem value="IMPORTING">引进中</SelectItem>
                                <SelectItem value="ISOLATING">隔离中</SelectItem>
                                <SelectItem value="COMPLETED">已完成</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '提交中...' : '确定'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 