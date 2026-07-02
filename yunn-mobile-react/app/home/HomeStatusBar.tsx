'use client'

// HomeStatusBar.tsx — 상태바 (시계 + 신호 + 배터리)
//
// 시계·배터리를 자체 useEffect로 관리하므로 부모(page.tsx)에 state가 필요 없다.
// 동작 근거 (home.js updateDeviceTime / updateBatteryStatus):
//   - 1초 interval로 시각 갱신
//   - navigator.getBattery() 없으면 72% 고정

import { useEffect, useState } from 'react'

export default function HomeStatusBar() {
  const [time, setTime] = useState('')
  const [batteryLevel, setBatteryLevel] = useState(72)

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<{ level: number; addEventListener: (e: string, fn: () => void) => void }>
    }
    if (!nav.getBattery) return
    nav.getBattery().then(b => {
      const update = () => setBatteryLevel(Math.max(8, Math.round(b.level * 100)))
      update()
      b.addEventListener('levelchange', update)
      b.addEventListener('chargingchange', update)
    })
  }, [])

  return (
    <div className="h-[40px] flex items-center justify-between px-4 text-[15px] font-semibold">
      <span>{time}</span>
      <div className="flex items-center gap-[6px] text-[11px]">
        {/* 신호 막대 4단계 — home.css .signal-bars */}
        <div className="inline-flex items-end gap-[2px] h-[14px]">
          {([5, 8, 11, 14] as const).map((h, i) => (
            <span key={i} className="block w-[3px] rounded-[2px] bg-black" style={{ height: h }} />
          ))}
        </div>
        <span className="font-semibold">5G</span>
        {/* 배터리 — home.css .battery-shell / .battery-level */}
        <div className="relative w-[24px] h-[12px] border-[1.5px] border-black rounded-[3px] p-[1px]">
          <div
            className="h-full rounded-[1.5px] transition-[width,background-color] duration-200"
            style={{
              width: `${batteryLevel}%`,
              backgroundColor: batteryLevel <= 20 ? '#E5484D' : '#000',
            }}
          />
          <span className="absolute -right-[4px] top-[3px] w-[2px] h-[5px] rounded-r-[2px] bg-black" />
        </div>
      </div>
    </div>
  )
}
