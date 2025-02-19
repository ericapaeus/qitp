'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { Pencil1Icon } from '@radix-ui/react-icons'
import type { Enterprise } from '@/types/api/enterprises'
import { formatDate } from '@/lib/utils'

const enterpriseSchema = z.object({
  name: z.string().min(2, '企业名称至少2个字符'),
  contact: z.object({
    person: z.string().min(2, '联系人至少2个字符'),
    phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入正确的手机号'),
    address: z.string().min(5, '地址至少5个字符'),
  }),
})

type EnterpriseFormData = z.infer<typeof enterpriseSchema>

interface EnterpriseInfoProps {
  enterprise: Enterprise
}

export function EnterpriseInfo({ enterprise }: EnterpriseInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const form = useForm<EnterpriseFormData>({
    resolver: zodResolver(enterpriseSchema),
    defaultValues: {
      name: enterprise.name,
      contact: enterprise.contact,
    },
  })

  const onSubmit = async (data: EnterpriseFormData) => {
    try {
      // TODO: 调用更新 API
      toast({
        title: '更新成功',
        description: '企业信息已更新',
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: '更新失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>企业信息</CardTitle>
          <CardDescription>查看和编辑企业基本信息</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Pencil1Icon className="h-4 w-4" />
          {isEditing ? '取消' : '编辑'}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>企业名称</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>地址</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  取消
                </Button>
                <Button type="submit">保存</Button>
              </div>
            </form>
          </Form>
        ) : (
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">企业代码</dt>
              <dd className="mt-1">{enterprise.code}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">企业名称</dt>
              <dd className="mt-1">{enterprise.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">联系人</dt>
              <dd className="mt-1">{enterprise.contact.person}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">联系电话</dt>
              <dd className="mt-1">{enterprise.contact.phone}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">地址</dt>
              <dd className="mt-1">{enterprise.contact.address}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">状态</dt>
              <dd className="mt-1">
                <Badge
                  variant={enterprise.status === 'ACTIVE' ? 'default' : 'secondary'}
                >
                  {enterprise.status === 'ACTIVE' ? '正常' : '已暂停'}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">最后同步</dt>
              <dd className="mt-1">{formatDate(enterprise.syncTime)}</dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  )
} 