import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react'
import { MotionReveal, MotionStagger, MotionItem } from '@/components/motion/MotionReveal'
import type { Product } from '@/lib/types'

export default async function LandingPage() {
  const supabase = createServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="max-w-6xl mx-auto px-10">

      {/* ── Hero ── */}
      <section className="pt-20 pb-16">
        <MotionReveal>
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-5"
            style={{ color: '#F97316' }}
          >
            Fresh Fruit Reservation
          </span>
        </MotionReveal>
        <MotionReveal delay={0.06}>
          <h1
            className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6"
            style={{ color: '#17182D', letterSpacing: '-0.025em', maxWidth: 640 }}
          >
            매일 아침 직접 고른<br />신선한 과일
          </h1>
        </MotionReveal>
        <MotionReveal delay={0.12}>
          <p className="text-[17px] leading-relaxed mb-9" style={{ color: 'rgba(23,24,45,0.55)', maxWidth: 400 }}>
            제철 과일을 미리 예약하고 편하게 픽업하세요.<br />
            실명 예약으로 노쇼 없이, 대기 없이.
          </p>
        </MotionReveal>
        <MotionReveal delay={0.18}>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-semibold text-[15px] text-white px-6 py-3 transition-opacity hover:opacity-80"
              style={{ background: '#F97316', borderRadius: 12 }}
            >
              예약하기 <ArrowRight size={15} />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 font-semibold text-[15px] px-6 py-3 transition-colors"
              style={{ background: '#FFFFFF', color: '#17182D', borderRadius: 12, border: '1px solid rgba(23,24,45,0.12)' }}
            >
              회원가입
            </Link>
          </div>
        </MotionReveal>
      </section>

      {/* ── Trust bar ── */}
      <MotionReveal delay={0.22}>
        <section
          className="rounded-[28px] p-6 mb-16 grid grid-cols-3 gap-4"
          style={{ background: '#FFFFFF', boxShadow: '0 20px 60px rgba(23,24,45,0.06)' }}
        >
          {[
            { Icon: Leaf,        label: '매일 직접 선별', desc: '신선도 보장' },
            { Icon: ShieldCheck, label: '실명 예약',     desc: '노쇼 없는 신뢰' },
            { Icon: Truck,       label: '당일 픽업',     desc: '대기 없이 바로' },
          ].map(({ Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-9 h-9 flex items-center justify-center shrink-0"
                style={{ background: '#FFF0E5', borderRadius: 10 }}
              >
                <Icon size={16} style={{ color: '#F97316' }} />
              </div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: '#17182D' }}>{label}</p>
                <p className="text-[12px]" style={{ color: 'rgba(23,24,45,0.45)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </section>
      </MotionReveal>

      {/* ── Products ── */}
      <section className="mb-24">
        <MotionReveal>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[12px] font-semibold tracking-widest uppercase mb-2" style={{ color: '#F97316' }}>Products</p>
              <h2 className="text-[26px] font-bold" style={{ color: '#17182D', letterSpacing: '-0.02em' }}>
                지금 예약 가능한 상품
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-1.5 text-[14px] font-medium transition-colors hover:opacity-70"
              style={{ color: 'rgba(23,24,45,0.5)' }}
            >
              전체보기 <ArrowRight size={14} />
            </Link>
          </div>
        </MotionReveal>

        {products && products.length > 0 ? (
          <MotionStagger className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {(products as Product[]).map((p) => (
              <MotionItem key={p.id}>
                <Link
                  href="/products"
                  className="group block rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(23,24,45,0.06)' }}
                >
                  <div
                    className="h-52 flex items-center justify-center overflow-hidden"
                    style={{ background: '#FFF0E5' }}
                  >
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full" style={{ background: 'rgba(249,115,22,0.15)' }} />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="font-semibold text-[15px] mb-1" style={{ color: '#17182D' }}>{p.name}</p>
                    {p.description && (
                      <p className="text-[13px] line-clamp-1 mb-3" style={{ color: 'rgba(23,24,45,0.45)' }}>{p.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[15px]" style={{ color: '#F97316' }}>{p.price.toLocaleString()}원</p>
                      <span
                        className="text-[12px] font-semibold px-2.5 py-1"
                        style={{ background: '#E5F3E9', color: '#16a34a', borderRadius: 8 }}
                      >
                        예약가능
                      </span>
                    </div>
                  </div>
                </Link>
              </MotionItem>
            ))}
          </MotionStagger>
        ) : (
          <div className="text-center py-20" style={{ color: 'rgba(23,24,45,0.35)', fontSize: 14 }}>
            현재 등록된 상품이 없습니다.
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <MotionReveal>
        <section
          className="rounded-[28px] p-10 mb-10 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: '#FFF0E5' }}
        >
          <div>
            <p className="text-[12px] font-semibold tracking-widest uppercase mb-2" style={{ color: '#F97316' }}>Get Started</p>
            <h2 className="text-[22px] font-bold mb-2" style={{ color: '#17182D', letterSpacing: '-0.02em' }}>
              지금 바로 시작하세요
            </h2>
            <p className="text-[15px]" style={{ color: 'rgba(23,24,45,0.5)' }}>
              회원가입 후 1분이면 첫 예약이 완료됩니다.
            </p>
          </div>
          <Link
            href="/register"
            className="shrink-0 inline-flex items-center gap-2 font-semibold text-[15px] px-6 py-3 transition-opacity hover:opacity-80"
            style={{ background: '#F97316', color: '#fff', borderRadius: 12, whiteSpace: 'nowrap' }}
          >
            무료로 시작하기 <ArrowRight size={15} />
          </Link>
        </section>
      </MotionReveal>

    </div>
  )
}
