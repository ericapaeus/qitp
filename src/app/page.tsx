import Image from "next/image";
import { Card } from '@/components/ui/card'
import {
  Activity,
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react'

// 统计卡片数据
const stats = [
  {
    title: '进行中的隔离试种',
    value: 12,
    change: '+2',
    icon: Activity,
    color: 'bg-blue-500',
  },
  {
    title: '待处理的企业申请',
    value: 8,
    change: '-1',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    title: '待审核的表单',
    value: 24,
    change: '+5',
    icon: FileText,
    color: 'bg-orange-500',
  },
  {
    title: '异常情况',
    value: 3,
    change: '+1',
    icon: AlertCircle,
    color: 'bg-red-500',
  },
]

// 最近活动数据
const activities = [
  {
    id: 1,
    type: 'success',
    title: '完成隔离试种',
    description: '企业A的玫瑰种苗隔离试种已完成,检疫结果合格',
    time: '10分钟前',
    icon: CheckCircle2,
  },
  {
    id: 2,
    type: 'warning',
    title: '新的企业申请',
    description: '企业B提交了新的引种申请,等待审核',
    time: '30分钟前',
    icon: Clock,
  },
  {
    id: 3,
    type: 'error',
    title: '发现异常情况',
    description: '企业C的样品在检验过程中发现异常,需要进一步处理',
    time: '1小时前',
    icon: AlertCircle,
  },
]

export default function Home() {
  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <p
                    className={`ml-2 text-sm font-medium ${
                      stat.change.startsWith('+')
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 最近活动 */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">最近活动</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <div key={activity.id} className="px-6 py-4">
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-lg ${
                    activity.type === 'success'
                      ? 'bg-green-100'
                      : activity.type === 'warning'
                      ? 'bg-yellow-100'
                      : 'bg-red-100'
                  }`}
                >
                  <activity.icon
                    className={`h-5 w-5 ${
                      activity.type === 'success'
                        ? 'text-green-600'
                        : activity.type === 'warning'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <span className="text-sm text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {activity.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
