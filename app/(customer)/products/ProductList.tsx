'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Minus, ShoppingBag, X } from 'lucide-react'
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

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((c) => c.product.id !== productId))
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
      <div className="text-center py-32 text-neutral-400">
        <ShoppingBag size={36} className="mx-auto mb-4 opacity-30" />
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
            <div
              key={p.id}
              className="group rounded-2xl overflow-hidden border border-neutral-100 hover:border-neutral-200 hover:shadow-md transition-all duration-300 bg-white"
            >
              <div
                className="h-48 overflow-hidden flex items-center justify-center relative"
                style={{ background: 'linear-gradient(135deg, #faf8f4, #f0e9dc)' }}
              >
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-neutral-200/60" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 text-[15px]">{p.name}</h3>
                {p.description && (
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                )}
                <p className="font-bold text-[15px] mt-3" style={{ color: '#ea6c0a' }}>
                  {p.price.toLocaleString()}원
                </p>
                {inCart ? (
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => updateQty(p.id, -1)}
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                    >
                      <Minus size={13} className="text-neutral-600" />
                    </button>
                    <span className="font-bold text-neutral-900 w-6 text-center">{inCart.quantity}</span>
                    <button
                      onClick={() => updateQty(p.id, 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ background: '#f97316' }}
                    >
                      <Plus size={13} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(p)}
                    className="mt-3 w-full py-2.5 rounded-xl border-2 border-neutral-900 text-neutral-900 text-[13px] font-semibold hover:bg-neutral-900 hover:text-white transition-all"
                  >
                    장바구니 담기
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Cart */}
      <div className="lg:w-80 w-full shrink-0">
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm sticky top-24 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-neutral-700" />
              <span className="font-bold text-neutral-900 text-[15px]">예약 장바구니</span>
            </div>
            {totalCount > 0 && (
              <span
                className="text-xs font-bold text-white rounded-full w-5 h-5 flex items-center justify-center"
                style={{ background: '#f97316' }}
              >
                {totalCount}
              </span>
            )}
          </div>

          <div className="p-5">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-neutral-400">
                <ShoppingBag size={28} className="mx-auto mb-3 opacity-25" />
                <p className="text-sm">담은 상품이 없습니다.</p>
              </div>
            ) : (
              <>
                <ul className="space-y-3 mb-5">
                  {cart.map((c) => (
                    <li key={c.product.id} className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-neutral-800 truncate">{c.product.name}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {c.product.price.toLocaleString()}원 × {c.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[13px] font-bold text-neutral-900">
                          {(c.product.price * c.quantity).toLocaleString()}원
                        </span>
                        <button onClick={() => removeFromCart(c.product.id)} className="text-neutral-300 hover:text-neutral-500 ml-1">
                          <X size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-neutral-100 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-neutral-500">상품 합계</span>
                    <span className="font-bold text-neutral-900 text-[15px]">{totalPrice.toLocaleString()}원</span>
                  </div>
                  <p className="text-xs text-neutral-400">결제는 픽업 시 현장에서 진행됩니다</p>
                </div>

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="요청사항을 입력하세요 (선택)"
                  className="w-full text-[13px] border border-neutral-200 rounded-xl p-3 resize-none mb-4 focus:outline-none focus:border-neutral-400 leading-relaxed placeholder:text-neutral-300"
                  rows={2}
                />

                <button
                  onClick={handleReserve}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-[15px] text-white transition-all disabled:opacity-50 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                >
                  {loading ? '예약 중...' : isLoggedIn ? '예약 완료하기' : '로그인 후 예약하기'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
