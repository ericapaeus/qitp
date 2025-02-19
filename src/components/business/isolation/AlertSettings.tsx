'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react'

interface NotificationChannel {
  id: string
  type: 'email' | 'sms' | 'wechat'
  name: string
  enabled: boolean
  config: {
    [key: string]: string
  }
}

interface AlertThreshold {
  metric: string
  min: number
  max: number
  enabled: boolean
}

export function AlertSettings() {
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: '1',
      type: 'email',
      name: '邮件通知',
      enabled: true,
      config: {
        email: 'user@example.com'
      }
    },
    {
      id: '2',
      type: 'sms',
      name: '短信通知',
      enabled: false,
      config: {
        phone: '13800138000'
      }
    },
    {
      id: '3',
      type: 'wechat',
      name: '微信通知',
      enabled: true,
      config: {
        openid: 'wx123456'
      }
    }
  ])

  const [thresholds, setThresholds] = useState<AlertThreshold[]>([
    {
      metric: 'temperature',
      min: 18,
      max: 25,
      enabled: true
    },
    {
      metric: 'humidity',
      min: 50,
      max: 80,
      enabled: true
    },
    {
      metric: 'light',
      min: 500,
      max: 1500,
      enabled: true
    }
  ])

  const handleChannelToggle = (channelId: string) => {
    setChannels(channels.map(channel => 
      channel.id === channelId 
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ))
  }

  const handleChannelConfigChange = (channelId: string, key: string, value: string) => {
    setChannels(channels.map(channel =>
      channel.id === channelId
        ? { ...channel, config: { ...channel.config, [key]: value } }
        : channel
    ))
  }

  const handleThresholdChange = (metric: string, field: 'min' | 'max', value: string) => {
    setThresholds(thresholds.map(threshold =>
      threshold.metric === metric
        ? { ...threshold, [field]: Number(value) }
        : threshold
    ))
  }

  const handleThresholdToggle = (metric: string) => {
    setThresholds(thresholds.map(threshold =>
      threshold.metric === metric
        ? { ...threshold, enabled: !threshold.enabled }
        : threshold
    ))
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'sms':
        return <Smartphone className="h-4 w-4" />
      case 'wechat':
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="thresholds">
        <TabsList>
          <TabsTrigger value="thresholds">告警阈值</TabsTrigger>
          <TabsTrigger value="channels">通知渠道</TabsTrigger>
        </TabsList>
        <TabsContent value="thresholds" className="space-y-4">
          {thresholds.map(threshold => (
            <Card key={threshold.metric} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Label>{threshold.metric === 'temperature' ? '温度' : 
                         threshold.metric === 'humidity' ? '湿度' : '光照'}</Label>
                  <Switch 
                    checked={threshold.enabled}
                    onCheckedChange={() => handleThresholdToggle(threshold.metric)}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>最小值</Label>
                  <Input
                    type="number"
                    value={threshold.min}
                    onChange={(e) => handleThresholdChange(threshold.metric, 'min', e.target.value)}
                    disabled={!threshold.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>最大值</Label>
                  <Input
                    type="number"
                    value={threshold.max}
                    onChange={(e) => handleThresholdChange(threshold.metric, 'max', e.target.value)}
                    disabled={!threshold.enabled}
                  />
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="channels" className="space-y-4">
          {channels.map(channel => (
            <Card key={channel.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getChannelIcon(channel.type)}
                  <Label>{channel.name}</Label>
                  <Switch 
                    checked={channel.enabled}
                    onCheckedChange={() => handleChannelToggle(channel.id)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                {Object.entries(channel.config).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label>{key === 'email' ? '邮箱地址' : 
                           key === 'phone' ? '手机号码' : '微信OpenID'}</Label>
                    <Input
                      value={value}
                      onChange={(e) => handleChannelConfigChange(channel.id, key, e.target.value)}
                      disabled={!channel.enabled}
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">取消</Button>
        <Button>保存设置</Button>
      </div>
    </div>
  )
} 