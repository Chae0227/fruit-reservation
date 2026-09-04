import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
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
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #faf8f4 0%, #f5efe6 50%, #ede0cc 100%)' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
          <div className="flex gap-3 text-5xl select-none">
            🍎🍊🍇🥭🍓
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 leading-tight">
            신선한 과일,<br />
            <span className="text-amber-600">직접 골라 예약</span>하세요
          </h1>
          <p className="text-stone-500 text-lg max-w-md">
            제철 과일을 미리 예약하고 편하게 픽업하세요.<br />
            실명 예약으로 노쇼 걱정 없이 신선하게.
          </p>
          <div className="flex gap-3">
            <Link
              href="/products"
              className="bg-stone-800 text-white px-6 py-3 rounded-full font-medium hover:bg-stone-700 transition-colors"
            >
              지금 예약하기
            </Link>
            <Link
              href="/register"
              className="border border-stone-300 text-stone-600 px-6 py-3 rounded-full font-medium hover:border-stone-400 transition-colors"
            >
              회원가입
            </Link>
          </div>
        </div>

        {/* Decorative fruits row */}
        <div className="w-full overflow-hidden" style={{ background: '#ede0cc', height: '4px' }} />
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: '📋', title: '실명 예약', desc: '이름과 연락처로 예약해 노쇼를 줄이고 신뢰를 높입니다.' },
          { icon: '🛒', title: '상품 선택', desc: '현재 판매 중인 제철 과일을 골라 수량을 지정하세요.' },
          { icon: '🏪', title: '직접 픽업', desc: '예약 후 가게에 방문해 현장 결제하고 가져가세요.' },
        ].map((f) => (
          <div key={f.title} className="text-center flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-stone-100 shadow-sm">
            <span className="text-4xl">{f.icon}</span>
            <h3 className="font-semibold text-stone-800">{f.title}</h3>
            <p className="text-sm text-stone-500">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Products preview */}
      {products && products.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-800">지금 예약 가능</h2>
            <Link href="/products" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              전체보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(products as Product[]).map((p) => (
              <Link
                key={p.id}
                href="/products"
                className="bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="h-36 flex items-center justify-center text-5xl"
                  style={{ background: '#faf8f4' }}
                >
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    '🍑'
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-stone-800 text-sm">{p.name}</p>
                  <p className="text-amber-600 font-bold text-sm mt-0.5">
                    {p.price.toLocaleString()}원
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
