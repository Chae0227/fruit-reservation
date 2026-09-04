import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/types'

export default async function LandingPage() {
  const supabase = createServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #faf8f4 0%, #f0e9dc 100%)' }}>
        <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col gap-6">
          <p className="text-xs font-semibold text-amber-600 tracking-widest uppercase">Fresh Fruit Reservation</p>
          <h1 className="text-5xl font-bold text-stone-900 leading-tight max-w-lg">
            신선한 과일을<br />미리 예약하세요
          </h1>
          <p className="text-stone-500 text-base max-w-sm leading-relaxed">
            제철 과일을 직접 골라 예약하고 편하게 픽업하세요.
            실명 예약으로 신뢰를 더했습니다.
          </p>
          <div className="flex gap-3 mt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-stone-700 transition-colors text-sm"
            >
              예약하기 <ArrowRight size={15} />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 px-6 py-3 rounded-xl font-medium hover:border-stone-300 hover:bg-white transition-colors text-sm"
            >
              회원가입
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-stone-100">
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-3 gap-10">
          {[
            { step: '01', title: '회원가입', desc: '이름과 연락처로 간단하게 가입합니다.' },
            { step: '02', title: '상품 선택', desc: '현재 판매 중인 제철 과일을 골라 수량을 지정합니다.' },
            { step: '03', title: '픽업 & 결제', desc: '예약 후 가게에 방문해 현장에서 결제합니다.' },
          ].map((s) => (
            <div key={s.step} className="flex flex-col gap-3">
              <span className="text-xs font-bold text-amber-500 tracking-widest">{s.step}</span>
              <h3 className="font-bold text-stone-800 text-lg">{s.title}</h3>
              <p className="text-sm text-stone-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products preview */}
      {products && products.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-stone-800">지금 예약 가능한 상품</h2>
            <Link href="/products" className="text-sm text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors">
              전체보기 <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {(products as Product[]).map((p) => (
              <Link
                key={p.id}
                href="/products"
                className="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:border-stone-200 hover:shadow-md transition-all"
              >
                <div
                  className="h-40 flex items-center justify-center overflow-hidden"
                  style={{ background: '#f5f0e8' }}
                >
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-stone-200" />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-stone-800 text-sm">{p.name}</p>
                  {p.description && <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{p.description}</p>}
                  <p className="text-amber-600 font-bold text-sm mt-2">{p.price.toLocaleString()}원</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
