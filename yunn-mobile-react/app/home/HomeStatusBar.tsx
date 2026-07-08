"use client";

// HomeStatusBar.tsx — 상태바 (시계 + 신호 + 배터리)
//
// 폰 목업 디자인을 그대로 옮긴 장식용 상태바. 웹에는 실제 기기 시각·배터리가 없으므로
// navigator.getBattery()/실시간 시계 없이 고정값으로 표시한다.

const MOCK_DEVICE_TIME = "9:41";
const MOCK_BATTERY_LEVEL = 72;

export default function HomeStatusBar() {
  return (
    <div className="h-[40px] flex items-center justify-between px-4 text-[15px] font-semibold">
      <span>{MOCK_DEVICE_TIME}</span>
      <div className="flex items-center gap-[6px] text-[11px]">
        {/* 신호 막대 4단계 — home.css .signal-bars */}
        <div className="inline-flex items-end gap-[2px] h-[14px]">
          {([5, 8, 11, 14] as const).map((h, i) => (
            <span
              key={i}
              className="block w-[3px] rounded-[2px] bg-black"
              style={{ height: h }}
            />
          ))}
        </div>
        <span className="font-semibold">5G</span>
        {/* 배터리 — home.css .battery-shell / .battery-level */}
        <div className="relative w-[24px] h-[12px] border-[1.5px] border-black rounded-[3px] p-[1px]">
          <div
            className="h-full rounded-[1.5px] bg-black"
            style={{ width: `${MOCK_BATTERY_LEVEL}%` }}
          />
          <span className="absolute -right-[4px] top-[3px] w-[2px] h-[5px] rounded-r-[2px] bg-black" />
        </div>
      </div>
    </div>
  );
}
