'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function SurveyPage() {
  const [time, setTime] = useState('--:--')

  useEffect(() => {
    const fmt = () => {
      const d = new Date()
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    }
    setTime(fmt())
    const id = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(id)
  }, [])

  const handleStart = () => {
    // TODO: 설문 Step 1으로 라우팅 (다음 단계 구현 시 router.push('/survey/step/1') 등으로 교체)
    console.log('Start My Skin Analysis clicked — navigate to Step 1')
  }

  return (
    /* 모바일 폰 셸: max-w-phone-max(393px), 중앙 정렬 */
    <div className="w-full max-w-phone-max min-h-screen mx-auto bg-white relative pb-3">

      {/* ── Status Bar ─────────────────────────────────────────────── */}
      <div className="h-10 px-4 pt-3 flex items-start justify-between text-black text-[15px] font-semibold leading-none">
        <span>{time}</span>
        <div className="flex items-center gap-2 text-xs font-semibold text-ink-faint">
          <span>Online</span>
        </div>
      </div>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="h-14 px-shell-x flex justify-between items-center relative bg-white">
        {/* 햄버거 아이콘 */}
        <i className="ph ph-list text-2xl cursor-pointer text-black relative z-[2]"></i>

        {/* 로고: 헤더 중앙에 절대 배치, 1.75배 스케일 */}
        <div
          className="absolute left-1/2 top-1/2 w-[128px] h-[58px] overflow-visible cursor-pointer z-[1]"
          style={{ transform: 'translate(-50%, -50%) scale(1.75)', transformOrigin: 'center' }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/images/yunn_logo.png"
              alt="YUNN"
              fill
              className="object-contain"
              priority
              sizes="128px"
            />
          </div>
        </div>

        {/* 우측 아이콘: 유저 + 장바구니 */}
        <div className="flex items-center gap-[14px] relative z-[2]">
          <i className="ph ph-user text-2xl cursor-pointer text-black"></i>
          <div className="relative">
            <i className="ph ph-shopping-bag text-2xl cursor-pointer text-black"></i>
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="px-shell-x">

        {/* Hero: 카피(왼쪽) + 이미지(오른쪽 절대 위치) */}
        <div className="relative min-h-[268px]">

          {/* 카피 텍스트 (폭 206px, 이미지와 겹치지 않게) */}
          <div className="relative z-[2] w-[206px]">
            <div className="text-xl font-semibold leading-[1.45] tracking-[-0.01em] text-black mb-5">
              <p className="mb-[18px]">
                Your acne<br />keeps{' '}
                <span className="text-primary">coming back.</span>
              </p>
              <p className="mb-[18px]">
                Your dark spots<br />
                <span className="text-primary">won&apos;t fade.</span>
              </p>
              <p>
                Let&apos;s find out{' '}
                <span className="text-primary">why.</span>
              </p>
            </div>
            <div className="text-xs font-normal leading-[1.66] text-black">
              Answer a few quick questions<br />
              and get your personalized<br />
              skin routine.
            </div>
          </div>

          {/* 히어로 이미지: 오른쪽 -19px 까지 뻗어 화면 밖으로 살짝 넘김 */}
          <div
            className="absolute right-[-19px] top-1 w-[188px] h-[262px] z-[1]"
            aria-hidden="true"
          >
            <div className="relative w-full h-full">
              {/* 초록 그라디언트 배경 (이미지 뒤) */}
              <div
                className="absolute inset-0 rounded-[15px_0_0_15px]"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0) 0%, #effaf7 48%, #c7ede4 100%)',
                }}
              />
              {/* 모델 이미지 */}
              <Image
                src="/images/survey.start.image.png"
                alt=""
                fill
                className="object-cover object-[58%_center] rounded-[15px_0_0_15px]"
                sizes="188px"
                priority
              />
            </div>
          </div>
        </div>

        {/* ── Feature Icons ──────────────────────────────────────── */}
        <div className="flex justify-between mt-[19px] mb-[35px] border-t border-b border-line py-[14px]">
          <div className="flex flex-col items-center gap-1.5 text-xs font-normal text-ink text-center flex-1">
            <i className="ph-light ph-clock text-2xl text-primary"></i>
            <span>Takes 3 minutes</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-xs font-normal text-ink text-center flex-1">
            <i className="ph-light ph-user-focus text-2xl text-primary"></i>
            <span>100% Private</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-xs font-normal text-ink text-center flex-1">
            <i className="ph-light ph-sparkle text-2xl text-primary"></i>
            <span>Personalized for you</span>
          </div>
        </div>

        {/* ── Description ────────────────────────────────────────── */}
        <div className="text-sm font-normal leading-[1.55] text-black mb-[38px] tracking-[-0.01em]">
          <div className="mb-[15px]">Most routines fail</div>
          <div className="mb-[15px]">
            because they&apos;re built on{' '}
            <span className="font-bold text-primary">guesswork.</span>
          </div>
          <div className="mb-[15px]">
            YUNN <span className="font-bold text-primary">analyzes</span> your skin,
          </div>
          <div className="mb-[15px]">
            your <span className="font-bold text-primary">environment,</span>
          </div>
          <div className="mb-[15px]">
            and your <span className="font-bold text-primary">lifestyle</span> then builds
          </div>
          <div className="mb-[15px]">
            a <span className="font-bold text-primary">14-day routine</span>
          </div>
          <div>designed specifically for you.</div>
        </div>

        {/* ── CTA Button ─────────────────────────────────────────── */}
        <button
          onClick={handleStart}
          className="flex justify-center items-center w-full bg-primary text-white h-11 rounded-btn text-xl font-medium border-0 cursor-pointer active:scale-[0.98] transition-transform"
        >
          Start My Skin Analysis
          <i className="ph ph-arrow-right ml-2 text-xl"></i>
        </button>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div className="text-xs font-normal text-ink-muted text-center mt-4">
          Takes 3 minutes. Results in 24 hours.
        </div>
      </div>

      {/* ── Home Indicator (iOS 하단 바 모사) ──────────────────────── */}
      <div className="w-[134px] h-[5px] mx-auto mt-[7px] rounded-full bg-black" aria-hidden="true" />
    </div>
  )
}
