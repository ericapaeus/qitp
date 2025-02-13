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

const formSchema = z.object({
  code: z
    .string()
    .min(1, '请输入企业编号')
    .max(20, '企业编号不能超过20个字符')
    .regex(/^[A-Za-z0-9-]+$/, '企业编号只能包含字母、数字和连字符'),
  name: z
    .string()
    .min(1, '请输入企业名称')
    .max(50, '企业名称不能超过50个字符'),
  contact: z.object({
    person: z
      .string()
      .min(1, '请输入联系人')
      .max(20, '联系人姓名不能超过20个字符'),
    phone: z
      .string()
      .min(1, '请输入联系电话')
      .regex(/^1[3-9]\d{9}$/, '请输入正确的手机号码'),
    address: z
      .string()
      .min(1, '请输入地址')
      .max(200, '地址不能超过200个字符'),
  }),
  status: z.enum(['ACTIVE', 'SUSPENDED']),
});

export type FormValues = z.infer<typeof formSchema>;

interface EnterpriseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: FormValues;
  onSubmit: (values: FormValues) => Promise<void>;
  loading?: boolean;
}

export function EnterpriseForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  loading = false,
}: EnterpriseFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      code: '',
      name: '',
      contact: {
        person: '',
        phone: '',
        address: '',
      },
      status: 'ACTIVE',
    },
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? '编辑企业' : '新增企业'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>企业编号</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="请输入企业编号" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>企业名称</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="请输入企业名称" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>联系人</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="请输入联系人" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>联系电话</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="请输入联系电话" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>地址</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="请输入地址" />
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
                        <SelectItem value="ACTIVE">活跃</SelectItem>
                        <SelectItem value="SUSPENDED">已暂停</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
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