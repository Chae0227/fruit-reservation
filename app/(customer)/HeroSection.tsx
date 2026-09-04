'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const EASE = [0.32, 0.72, 0, 1] as const

const PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=700&q=80', bg: '#FFF0E5', float: { y: [0, -14, 0], dur: 3.6, del: 0 } },
  { src: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=700&q=80', bg: '#E5F3E9', float: { y: [0, -9, 0],  dur: 2.9, del: 0.6 } },
  { src: 'https://images.unsplash.com/photo-1571575173927-c0be9b2f3b8c?auto=format&fit=crop&w=700&q=80', bg: '#DCEBFF', float: { y: [0, -11, 0], dur: 4.1, del: 1.1 } },
  { src: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=700&q=80', bg: '#FFF4B8', float: { y: [0, -16, 0], dur: 3.3, del: 0.8 } },
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: '#F8F8F5', minHeight: '90vh' }}>

      {/* ── Animated background blobs ── */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{ width: 600, height: 600, top: '-15%', right: '15%', filter: 'blur(80px)', background: 'radial-gradient(circle, rgba(245,166,35,0.22) 0%, transparent 65%)' }}
        animate={{ x: [0, 35, 0], y: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 13, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{ width: 450, height: 450, bottom: '5%', right: '8%', filter: 'blur(70px)', background: 'radial-gradient(circle, rgba(229,243,233,0.9) 0%, transparent 65%)' }}
        animate={{ x: [0, -20, 0], y: [0, 18, 0] }}
        transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{ width: 350, height: 350, top: '40%', left: '-5%', filter: 'blur(65px)', background: 'radial-gradient(circle, rgba(220,235,255,0.8) 0%, transparent 65%)' }}
        animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut', delay: 4 }}
      />

      <div className="max-w-6xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-10 relative z-10 py-16" style={{ minHeight: '90vh' }}>

        {/* ── Left: text ── */}
        <div className="flex-1 flex flex-col justify-center">

          {/* Badge */}
          <motion.span
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase mb-7 px-4 py-2 rounded-full self-start"
            style={{ background: '#FFF0E5', color: '#F5A623' }}
          >
            ✦ 오색청과 송천점
          </motion.span>

          {/* Headline — line by line */}
          <h1 className="font-black leading-[1.05] mb-7 overflow-hidden" style={{ fontSize: 'clamp(3rem, 5.5vw, 4.8rem)', letterSpacing: '-0.03em' }}>
            {['매일 아침', '직접 고른', '신선한 과일'].map((line, i) => (
              <motion.div key={line} style={{ overflow: 'hidden' }}>
                <motion.span
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ delay: 0.08 + i * 0.12, duration: 0.75, ease: EASE }}
                  style={{ display: 'block', color: i === 2 ? '#F5A623' : '#17182D' }}
                >
                  {line}
                </motion.span>
              </motion.div>
            ))}
          </h1>

          {/* Sub-text */}
          <motion.p
            initial={{ y: 20, opacity: 0, filter: 'blur(6px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.48, duration: 0.7, ease: EASE }}
            className="text-[16px] leading-relaxed mb-10"
            style={{ color: 'rgba(23,24,45,0.5)', maxWidth: 360 }}
          >
            제철 과일을 미리 예약하고 대기 없이 픽업하세요.<br />
            실명 예약으로 노쇼 없이 더 신뢰있게.
          </motion.p>

          {/* CTA buttons */}
          <div className="flex gap-3 flex-wrap mb-14">
            {[
              {
                href: '/products',
                label: '지금 예약하기',
                style: { background: '#F5A623', color: '#fff', borderRadius: 14 },
                icon: true,
              },
              {
                href: '/register',
                label: '회원가입',
                style: { background: '#FFFFFF', color: '#17182D', borderRadius: 14, border: '1.5px solid rgba(23,24,45,0.12)' },
                icon: false,
              },
            ].map(({ href, label, style, icon }, i) => (
              <motion.div
                key={href}
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.56 + i * 0.08, type: 'spring', stiffness: 420, damping: 22 }}
              >
                <Link
                  href={href}
                  className="inline-flex items-center gap-2.5 font-bold text-[15px] px-7 py-4 transition-opacity hover:opacity-80"
                  style={style}
                >
                  {label}
                  {icon && <ArrowRight size={16} />}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-10">
            {[
              { num: '매일', label: '직접 선별' },
              { num: '100%', label: '실명 예약' },
              { num: '0분', label: '픽업 대기' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.72 + i * 0.07, duration: 0.5, ease: EASE }}
              >
                <p className="text-[24px] font-black" style={{ color: '#17182D', letterSpacing: '-0.025em' }}>{s.num}</p>
                <p className="text-[12px] font-medium mt-0.5" style={{ color: 'rgba(23,24,45,0.4)' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Right: floating photo collage ── */}
        <div className="hidden lg:flex w-[47%] shrink-0 gap-3" style={{ height: 580 }}>

          {/* Left column */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Big top card */}
            <motion.div
              initial={{ y: 70, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.22, duration: 0.8, ease: EASE }}
              style={{ flex: '1.65' }}
            >
              <motion.div
                animate={{ y: PHOTOS[0].float.y }}
                transition={{ repeat: Infinity, duration: PHOTOS[0].float.dur, ease: 'easeInOut', delay: PHOTOS[0].float.del }}
                style={{ height: '100%', borderRadius: 24, overflow: 'hidden', background: PHOTOS[0].bg }}
              >
                <img src={PHOTOS[0].src} alt="과일" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            </motion.div>

            {/* Small bottom card */}
            <motion.div
              initial={{ y: 70, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.38, duration: 0.8, ease: EASE }}
              style={{ flex: 1 }}
            >
              <motion.div
                animate={{ y: PHOTOS[1].float.y }}
                transition={{ repeat: Infinity, duration: PHOTOS[1].float.dur, ease: 'easeInOut', delay: PHOTOS[1].float.del }}
                style={{ height: '100%', borderRadius: 24, overflow: 'hidden', background: PHOTOS[1].bg }}
              >
                <img src={PHOTOS[1].src} alt="과일" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            </motion.div>
          </div>

          {/* Right column — shifted down */}
          <div className="flex-1 flex flex-col gap-3" style={{ paddingTop: 44 }}>
            {/* Medium top card */}
            <motion.div
              initial={{ y: 70, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
              style={{ flex: 1 }}
            >
              <motion.div
                animate={{ y: PHOTOS[2].float.y }}
                transition={{ repeat: Infinity, duration: PHOTOS[2].float.dur, ease: 'easeInOut', delay: PHOTOS[2].float.del }}
                style={{ height: '100%', borderRadius: 24, overflow: 'hidden', background: PHOTOS[2].bg }}
              >
                <img src={PHOTOS[2].src} alt="과일" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            </motion.div>

            {/* Big bottom card */}
            <motion.div
              initial={{ y: 70, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.46, duration: 0.8, ease: EASE }}
              style={{ flex: '1.45' }}
            >
              <motion.div
                animate={{ y: PHOTOS[3].float.y }}
                transition={{ repeat: Infinity, duration: PHOTOS[3].float.dur, ease: 'easeInOut', delay: PHOTOS[3].float.del }}
                style={{ height: '100%', borderRadius: 24, overflow: 'hidden', background: PHOTOS[3].bg }}
              >
                <img src={PHOTOS[3].src} alt="과일" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  )
}
