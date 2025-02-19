'use client'

import { useEffect, useRef } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Enterprise } from '@/types/api/enterprises'

declare global {
  interface Window {
    AMap: {
      Map: new (container: HTMLElement, options: any) => any
      Scale: new () => any
      ToolBar: new () => any
      Geocoder: new () => {
        getLocation: (
          address: string,
          callback: (status: string, result: { geocodes: Array<{ location: { lng: number; lat: number } }> }) => void
        ) => void
      }
      Marker: new (options: {
        position: [number, number]
        map: any
        label: {
          content: string
          direction: string
        }
      }) => void
    }
  }
}

interface EnterpriseMapProps {
  enterprise: Enterprise
}

export function EnterpriseMap({ enterprise }: EnterpriseMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // 动态加载高德地图 SDK
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${process.env.NEXT_PUBLIC_AMAP_KEY}`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      if (mapRef.current && !mapInstanceRef.current) {
        // 初始化地图
        mapInstanceRef.current = new window.AMap.Map(mapRef.current, {
          zoom: 13,
          viewMode: '3D',
        })

        // 添加控件
        mapInstanceRef.current.addControl(new window.AMap.Scale())
        mapInstanceRef.current.addControl(new window.AMap.ToolBar())

        // 地理编码服务
        const geocoder = new window.AMap.Geocoder()
        geocoder.getLocation(enterprise.contact.address, (status: string, result) => {
          if (status === 'complete' && result.geocodes.length) {
            const location = result.geocodes[0].location
            
            // 设置地图中心点
            mapInstanceRef.current.setCenter([location.lng, location.lat])

            // 添加标记
            new window.AMap.Marker({
              position: [location.lng, location.lat],
              map: mapInstanceRef.current,
              label: {
                content: enterprise.name,
                direction: 'top',
              },
            })
          }
        })
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
      document.head.removeChild(script)
    }
  }, [enterprise])

  return (
    <Card>
      <CardHeader>
        <CardTitle>地理位置</CardTitle>
        <CardDescription>查看企业地理位置</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="h-[500px] w-full rounded-md" />
      </CardContent>
    </Card>
  )
} 