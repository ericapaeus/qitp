'use client'

import { BellIcon } from '@radix-ui/react-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotification } from '@/contexts/NotificationContext'
import { formatDate } from '@/lib/utils'

export function NotificationList() {
  const { notifications, markAsRead, clearAll } = useNotification()

  const unreadCount = notifications.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <div className="text-sm font-medium">通知</div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              清除全部
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              暂无通知
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-4 focus:bg-gray-100"
                onSelect={() => markAsRead(notification.id)}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="font-medium">{notification.title}</div>
                  <Badge
                    variant={
                      notification.type === 'error'
                        ? 'destructive'
                        : notification.type === 'warning'
                        ? 'warning'
                        : notification.type === 'success'
                        ? 'success'
                        : 'default'
                    }
                  >
                    {notification.type}
                  </Badge>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {notification.message}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {formatDate(notification.timestamp)}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 