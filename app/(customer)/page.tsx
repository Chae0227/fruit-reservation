import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ArrowRight, Truck, ShieldCheck, Leaf } from 'lucide-react'
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
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(155deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 70% 50%, #f97316 0%, transparent 60%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-5 py-28 md:py-36">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-orange-400 mb-5">
              Fresh Fruit Reservation
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.15] mb-6">
              매일 아침 직접 고른<br />
              <span style={{ color: '#fba040' }}>신선한 과일</span>을<br />
              예약하세요
            </h1>
            <p className="text-neutral-400 text-lg leading-relaxed mb-10 max-w-md">
              제철 과일을 미리 예약하고 편하게 픽업하세요.
              실명 예약으로 대기 없이 받아가실 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] transition-all hover:gap-3"
                style={{ background: '#f97316', color: '#fff' }}
              >
                지금 예약하기 <ArrowRight size={16} />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-white border border-white/20 hover:border-white/50 transition-all"
              >
                무료 회원가입
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-5 py-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { Icon: Leaf, label: '매일 직접 선별', desc: '신선도 보장' },
              { Icon: ShieldCheck, label: '실명 예약', desc: '노쇼 없는 신뢰' },
              { Icon: Truck, label: '당일 픽업', desc: '대기 없이 바로' },
            ].map(({ Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{label}</p>
                  <p className="text-xs text-neutral-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-orange-500 tracking-widest uppercase mb-2">Products</p>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">지금 예약 가능한 상품</h2>
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center gap-1.5 text-[14px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            전체보기 <ArrowRight size={14} />
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {(products as Product[]).map((p) => (
              <Link
                key={p.id}
                href="/products"
                className="group rounded-2xl overflow-hidden border border-neutral-100 hover:border-neutral-200 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="h-52 overflow-hidden flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #faf8f4, #f0e9dc)' }}
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-neutral-200/60" />
                  )}
                </div>
                <div className="p-5 bg-white">
                  <p className="font-semibold text-neutral-900 text-[15px]">{p.name}</p>
                  {p.description && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{p.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-base font-bold" style={{ color: '#ea6c0a' }}>
                      {p.price.toLocaleString()}원
                    </p>
                    <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full">
                      예약가능
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-sm">현재 등록된 상품이 없습니다.</p>
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-neutral-600 border border-neutral-200 px-5 py-2.5 rounded-full hover:bg-neutral-50 transition-colors"
          >
            전체 상품 보기 <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-5 mb-20 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1c1c1c, #2e1a0e)' }}>
        <div className="max-w-6xl mx-auto px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              지금 바로 시작하세요
            </h2>
            <p className="text-neutral-400 text-[15px]">
              회원가입하고 첫 예약까지 1분이면 충분합니다.
            </p>
          </div>
          <Link
            href="/register"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-neutral-900 transition-all hover:gap-3"
            style={{ background: '#fba040' }}
          >
            무료로 시작하기 <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
