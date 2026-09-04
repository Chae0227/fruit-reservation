import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ArrowRight } from 'lucide-react'
import { MotionReveal, MotionStagger, MotionItem } from '@/components/motion/MotionReveal'
import type { Product } from '@/lib/types'

const FRUIT_PHOTOS = [
  'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1571575173927-c0be9b2f3b8c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=600&q=80',
]

export default async function LandingPage() {
  const supabase = createServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ background: '#F8F8F5' }}>
        <div className="max-w-6xl mx-auto px-8 pt-14 pb-0 flex flex-col lg:flex-row items-stretch gap-10 min-h-[82vh]">

          {/* Left */}
          <div className="flex-1 flex flex-col justify-center py-10">
            <MotionReveal>
              <span className="inline-block text-[11px] font-bold tracking-[0.18em] uppercase mb-6 px-3 py-1.5 rounded-full"
                style={{ background: '#FFF0E5', color: '#F97316' }}>
                오색청과 송천점
              </span>
            </MotionReveal>
            <MotionReveal delay={0.05}>
              <h1 className="font-bold leading-[1.05] mb-6"
                style={{ color: '#17182D', fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', letterSpacing: '-0.03em' }}>
                매일 아침<br />직접 고른<br /><span style={{ color: '#F97316' }}>신선한 과일</span>
              </h1>
            </MotionReveal>
            <MotionReveal delay={0.1}>
              <p className="text-[16px] leading-relaxed mb-10" style={{ color: 'rgba(23,24,45,0.5)', maxWidth: 360 }}>
                제철 과일을 미리 예약하고 대기 없이 픽업하세요.<br />
                실명 예약으로 노쇼 없이 더 신뢰있게.
              </p>
            </MotionReveal>
            <MotionReveal delay={0.15}>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2.5 font-bold text-[15px] text-white px-7 py-3.5 transition-opacity hover:opacity-85"
                  style={{ background: '#F97316', borderRadius: 14 }}
                >
                  지금 예약하기 <ArrowRight size={16} />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 font-semibold text-[15px] px-7 py-3.5 transition-colors"
                  style={{ background: '#FFFFFF', color: '#17182D', borderRadius: 14, border: '1.5px solid rgba(23,24,45,0.12)' }}
                >
                  회원가입
                </Link>
              </div>
            </MotionReveal>

            {/* Stats row */}
            <MotionReveal delay={0.2}>
              <div className="flex gap-8 mt-14">
                {[
                  { num: '매일', label: '직접 선별' },
                  { num: '100%', label: '실명 예약' },
                  { num: '0분', label: '픽업 대기' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-[22px] font-bold" style={{ color: '#17182D', letterSpacing: '-0.02em' }}>{s.num}</p>
                    <p className="text-[12px] font-medium mt-0.5" style={{ color: 'rgba(23,24,45,0.4)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </MotionReveal>
          </div>

          {/* Right — photo collage */}
          <MotionReveal delay={0.08} className="hidden lg:flex items-end w-[48%] shrink-0">
            <div className="w-full h-[580px] flex gap-3 pb-0">
              {/* Left col — tall */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex-[1.6] rounded-[24px] overflow-hidden" style={{ background: '#FFF0E5' }}>
                  <img src={FRUIT_PHOTOS[0]} alt="과일" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 rounded-[24px] overflow-hidden" style={{ background: '#E5F3E9' }}>
                  <img src={FRUIT_PHOTOS[1]} alt="과일" className="w-full h-full object-cover" />
                </div>
              </div>
              {/* Right col — offset */}
              <div className="flex-1 flex flex-col gap-3 pt-10">
                <div className="flex-1 rounded-[24px] overflow-hidden" style={{ background: '#DCEBFF' }}>
                  <img src={FRUIT_PHOTOS[2]} alt="과일" className="w-full h-full object-cover" />
                </div>
                <div className="flex-[1.4] rounded-[24px] overflow-hidden" style={{ background: '#FFF4B8' }}>
                  <img src={FRUIT_PHOTOS[3]} alt="과일" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="py-20" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto px-8">
          <MotionReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: '#F97316' }}>Today&apos;s Pick</p>
                <h2 className="text-[32px] font-bold" style={{ color: '#17182D', letterSpacing: '-0.025em' }}>
                  지금 예약 가능한 상품
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden md:inline-flex items-center gap-1.5 text-[14px] font-semibold px-5 py-2.5 transition-opacity hover:opacity-70"
                style={{ color: '#F97316', border: '1.5px solid rgba(249,115,22,0.25)', borderRadius: 12 }}
              >
                전체보기 <ArrowRight size={14} />
              </Link>
            </div>
          </MotionReveal>

          {products && products.length > 0 ? (
            <MotionStagger className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(products as Product[]).map((p) => (
                <MotionItem key={p.id}>
                  <Link
                    href="/products"
                    className="group block rounded-[20px] overflow-hidden"
                    style={{ background: '#F8F8F5', boxShadow: '0 1px 4px rgba(23,24,45,0.06)' }}
                  >
                    <div className="h-44 overflow-hidden relative" style={{ background: '#FFF0E5' }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-5xl">
                          🍊
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: '#E5F3E9', color: '#15803d' }}>예약가능</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-[14px] mb-0.5 truncate" style={{ color: '#17182D' }}>{p.name}</p>
                      {p.description && (
                        <p className="text-[12px] line-clamp-1 mb-2" style={{ color: 'rgba(23,24,45,0.4)' }}>{p.description}</p>
                      )}
                      <p className="font-bold text-[16px]" style={{ color: '#F97316' }}>{p.price.toLocaleString()}원</p>
                    </div>
                  </Link>
                </MotionItem>
              ))}
            </MotionStagger>
          ) : (
            <div className="text-center py-20 text-[14px]" style={{ color: 'rgba(23,24,45,0.35)' }}>
              현재 등록된 상품이 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20" style={{ background: '#F8F8F5' }}>
        <div className="max-w-6xl mx-auto px-8">
          <MotionReveal>
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase mb-3 text-center" style={{ color: '#F97316' }}>How it works</p>
            <h2 className="text-[28px] font-bold text-center mb-14" style={{ color: '#17182D', letterSpacing: '-0.02em' }}>
              3단계면 완료
            </h2>
          </MotionReveal>
          <MotionStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: '회원가입', desc: '이름과 연락처로\n간단하게 가입', bg: '#FFF0E5', color: '#F97316' },
              { step: '02', title: '상품 선택', desc: '원하는 과일을\n수량 지정해서 담기', bg: '#DCEBFF', color: '#1d4ed8' },
              { step: '03', title: '픽업', desc: '예약 후 매장 방문\n현장 결제로 간편하게', bg: '#E5F3E9', color: '#15803d' },
            ].map((s) => (
              <MotionItem key={s.step}>
                <div className="rounded-[24px] p-8" style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(23,24,45,0.05)' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: s.bg }}>
                    <span className="text-[13px] font-black" style={{ color: s.color }}>{s.step}</span>
                  </div>
                  <h3 className="text-[18px] font-bold mb-2" style={{ color: '#17182D' }}>{s.title}</h3>
                  <p className="text-[14px] leading-relaxed whitespace-pre-line" style={{ color: 'rgba(23,24,45,0.5)' }}>{s.desc}</p>
                </div>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto px-8">
          <MotionReveal>
            <div className="rounded-[28px] px-12 py-14 flex flex-col md:flex-row items-center justify-between gap-8" style={{ background: '#FFF0E5' }}>
              <div>
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: '#F97316' }}>Get started</p>
                <h2 className="text-[28px] font-bold mb-2" style={{ color: '#17182D', letterSpacing: '-0.02em' }}>
                  지금 바로 시작하세요
                </h2>
                <p className="text-[15px]" style={{ color: 'rgba(23,24,45,0.5)' }}>
                  회원가입 1분이면 첫 예약 완료입니다.
                </p>
              </div>
              <Link
                href="/register"
                className="shrink-0 inline-flex items-center gap-2.5 font-bold text-[15px] text-white px-8 py-4 transition-opacity hover:opacity-85"
                style={{ background: '#F97316', borderRadius: 14, whiteSpace: 'nowrap' }}
              >
                무료 회원가입 <ArrowRight size={16} />
              </Link>
            </div>
          </MotionReveal>
        </div>
      </section>
    </div>
  )
}
