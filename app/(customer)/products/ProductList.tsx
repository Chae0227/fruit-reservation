'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import type { Product } from '@/lib/types'

type CartItem = { product: Product; quantity: number }

export default function ProductList({ products, isLoggedIn }: { products: Product[]; isLoggedIn: boolean }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id)
      if (existing) return prev.map((c) => c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c)
      return [...prev, { product, quantity: 1 }]
    })
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) => prev
      .map((c) => c.product.id === productId ? { ...c, quantity: c.quantity + delta } : c)
      .filter((c) => c.quantity > 0)
    )
  }

  const totalPrice = cart.reduce((sum, c) => sum + c.product.price * c.quantity, 0)
  const totalCount = cart.reduce((sum, c) => sum + c.quantity, 0)

  async function handleReserve() {
    if (!isLoggedIn) { router.push('/login'); return }
    if (!cart.length) return
    setLoading(true)
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map((c) => ({ product_id: c.product.id, quantity: c.quantity })),
        note,
      }),
    })
    setLoading(false)
    if (res.ok) { setCart([]); setNote(''); router.push('/mypage') }
  }

  if (!products.length) {
    return (
      <div className="text-center py-24 text-stone-400">
        <p className="text-sm">현재 예약 가능한 상품이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Product grid */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-5">
        {products.map((p) => {
          const inCart = cart.find((c) => c.product.id === p.id)
          return (
            <div key={p.id} className="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:border-stone-200 hover:shadow-md transition-all">
              <div className="h-44 overflow-hidden" style={{ background: '#f5f0e8' }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-stone-200" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-stone-800">{p.name}</h3>
                {p.description && <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>}
                <p className="text-amber-600 font-bold mt-2 text-sm">{p.price.toLocaleString()}원</p>
                {inCart ? (
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => updateQty(p.id, -1)} className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors">
                      <Minus size={13} className="text-stone-500" />
                    </button>
                    <span className="font-bold text-stone-800 w-5 text-center">{inCart.quantity}</span>
                    <button onClick={() => updateQty(p.id, 1)} className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center hover:bg-stone-700 transition-colors">
                      <Plus size={13} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(p)}
                    className="mt-3 w-full py-2 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
                  >
                    담기
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Cart */}
      <div className="lg:w-72 shrink-0 w-full">
        <div className="bg-white rounded-2xl border border-stone-100 p-5 sticky top-20">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart size={15} className="text-stone-500" />
            <h2 className="font-bold text-stone-800 text-sm">예약 내역</h2>
            {totalCount > 0 && (
              <span className="ml-auto bg-stone-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{totalCount}</span>
            )}
          </div>
          {cart.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-8">담은 상품이 없습니다.</p>
          ) : (
            <>
              <ul className="space-y-2.5 mb-4">
                {cart.map((c) => (
                  <li key={c.product.id} className="flex items-center justify-between text-sm">
                    <span className="text-stone-600 text-xs">{c.product.name} <span className="text-stone-400">× {c.quantity}</span></span>
                    <span className="font-semibold text-stone-800 text-xs">{(c.product.price * c.quantity).toLocaleString()}원</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-stone-100 pt-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-stone-500">합계</span>
                  <span className="font-bold text-stone-900">{totalPrice.toLocaleString()}원</span>
                </div>
                <p className="text-xs text-stone-400 mt-1">현장 결제</p>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="요청사항 (선택)"
                className="w-full text-xs border border-stone-200 rounded-xl p-3 resize-none mb-3 focus:outline-none focus:border-stone-400 leading-relaxed"
                rows={2}
              />
              <button
                onClick={handleReserve}
                disabled={loading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? '예약 중...' : isLoggedIn ? '예약하기' : '로그인 후 예약'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
