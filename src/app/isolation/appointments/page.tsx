'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { Plus, Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AppointmentForm } from '@/components/business/isolation/AppointmentForm'

// 模拟预约数据
const appointments = [
  {
    id: '1',
    date: '2024-03-15',
    time: '09:30',
    enterprise: '某某农业科技有限公司',
    contact: '张三',
    phone: '13800138000',
    sampleInfo: {
      name: '水稻种子',
      quantity: '500g',
      sourceCountry: '日本'
    },
    status: 'pending'
  },
  {
    id: '2',
    date: '2024-03-15',
    time: '14:00',
    enterprise: '某某种业股份有限公司',
    contact: '李四',
    phone: '13900139000',
    sampleInfo: {
      name: '玉米种子',
      quantity: '1kg',
      sourceCountry: '美国'
    },
    status: 'confirmed'
  }
]

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showAppointment, setShowAppointment] = useState(false)

  // 根据日期筛选预约
  const filteredAppointments = appointments.filter(
    app => app.date === format(selectedDate || new Date(), 'yyyy-MM-dd')
  )

  const handleSubmitAppointment = (data: any) => {
    console.log('Submit appointment:', data)
    setShowAppointment(false)
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="预约送样管理"
        description="管理样品送检预约，合理安排接收时间"
        action={
          <Button onClick={() => setShowAppointment(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新建预约
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-[400px,1fr]">
        {/* 日历卡片 */}
        <Card className="p-6 h-fit">
          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-medium">
                  {format(selectedDate || new Date(), 'yyyy年MM月')}
                </h3>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={zhCN}
                className="w-full select-none"
                classNames={{
                  months: "space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
                showOutsideDays={true}
                fixedWeeks
                weekStartsOn={1}
              />
            </div>
            
            {/* 图例说明 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-500">待确认</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-500">已确认</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 预约列表 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">
              {selectedDate ? format(selectedDate, 'yyyy年MM月dd日') : '今日'}预约
            </h3>
          </div>

          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(appointment => (
                  <Card key={appointment.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={appointment.status === 'confirmed' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}
                          >
                            {appointment.status === 'confirmed' ? '已确认' : '待确认'}
                          </Badge>
                          <span className="font-medium">{appointment.enterprise}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>预约时间：{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>样品信息：{appointment.sampleInfo.name} / {appointment.sampleInfo.quantity} / {appointment.sampleInfo.sourceCountry}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>联系人：{appointment.contact}</span>
                            <span>电话：{appointment.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {appointment.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50">拒绝</Button>
                            <Button size="sm" className="bg-green-500 hover:bg-green-600">确认</Button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50">取消预约</Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center text-gray-500 py-12">
                  当日暂无预约
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* 新建预约对话框 */}
      <Dialog open={showAppointment} onOpenChange={setShowAppointment}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新建预约</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            onSubmit={handleSubmitAppointment}
            onCancel={() => setShowAppointment(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 