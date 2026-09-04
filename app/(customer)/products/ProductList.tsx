'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ShoppingBag, X } from 'lucide-react'
import type { Product } from '@/lib/types'

type CartItem = { product: Product; quantity: number }

const EASE = [0.32, 0.72, 0, 1] as const

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
      <div className="text-center py-32" style={{ color: 'rgba(23,24,45,0.35)' }}>
        <ShoppingBag size={32} className="mx-auto mb-4 opacity-30" />
        <p className="text-sm">현재 예약 가능한 상품이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Grid */}
      <motion.div
        className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-5"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {products.map((p) => {
          const inCart = cart.find((c) => c.product.id === p.id)
          return (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-[20px] overflow-hidden"
              style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(23,24,45,0.06)' }}
            >
              <div className="h-48 flex items-center justify-center overflow-hidden" style={{ background: '#FFF0E5' }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="w-18 h-18 rounded-full" style={{ background: 'rgba(249,115,22,0.15)', width: 72, height: 72 }} />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[15px] mb-1" style={{ color: '#17182D' }}>{p.name}</h3>
                {p.description && (
                  <p className="text-[13px] line-clamp-2 leading-relaxed mb-2" style={{ color: 'rgba(23,24,45,0.45)' }}>
                    {p.description}
                  </p>
                )}
                <p className="font-bold text-[15px] mb-3" style={{ color: '#F97316' }}>{p.price.toLocaleString()}원</p>

                {inCart ? (
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => updateQty(p.id, -1)}
                      whileTap={{ scale: 0.92 }}
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ border: '1px solid rgba(23,24,45,0.15)', borderRadius: 8 }}
                    >
                      <Minus size={13} style={{ color: '#17182D' }} />
                    </motion.button>
                    <span className="font-bold text-[15px] w-6 text-center" style={{ color: '#17182D' }}>{inCart.quantity}</span>
                    <motion.button
                      onClick={() => updateQty(p.id, 1)}
                      whileTap={{ scale: 0.92 }}
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ background: '#17182D', borderRadius: 8 }}
                    >
                      <Plus size={13} className="text-white" />
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    onClick={() => addToCart(p)}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2.5 text-[13px] font-semibold transition-colors"
                    style={{ border: '1.5px solid #17182D', borderRadius: 10, color: '#17182D', background: 'transparent' }}
                    onHoverStart={(e) => { (e.target as HTMLElement).style.background = '#17182D'; (e.target as HTMLElement).style.color = '#fff' }}
                    onHoverEnd={(e) => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = '#17182D' }}
                  >
                    장바구니 담기
                  </motion.button>
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Cart panel */}
      <div className="lg:w-80 w-full shrink-0">
        <div className="rounded-[20px] overflow-hidden sticky top-20" style={{ background: '#FFFFFF', boxShadow: '0 20px 60px rgba(23,24,45,0.08)' }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(23,24,45,0.07)' }}>
            <div className="flex items-center gap-2">
              <ShoppingBag size={15} style={{ color: '#17182D' }} />
              <span className="font-bold text-[14px]" style={{ color: '#17182D' }}>예약 장바구니</span>
            </div>
            <AnimatePresence>
              {totalCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 480, damping: 20 }}
                  className="text-[11px] font-bold text-white flex items-center justify-center"
                  style={{ background: '#F97316', borderRadius: '50%', width: 20, height: 20 }}
                >
                  {totalCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="p-5">
            {cart.length === 0 ? (
              <div className="text-center py-10" style={{ color: 'rgba(23,24,45,0.3)' }}>
                <ShoppingBag size={26} className="mx-auto mb-3 opacity-30" />
                <p className="text-[13px]">담은 상품이 없습니다.</p>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  <ul className="space-y-3 mb-5">
                    {cart.map((c) => (
                      <motion.li
                        key={c.product.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.22, ease: EASE }}
                        className="flex items-start justify-between gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold truncate" style={{ color: '#17182D' }}>{c.product.name}</p>
                          <p className="text-[12px]" style={{ color: 'rgba(23,24,45,0.4)' }}>
                            {c.product.price.toLocaleString()}원 × {c.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[13px] font-bold" style={{ color: '#17182D' }}>
                            {(c.product.price * c.quantity).toLocaleString()}원
                          </span>
                          <button onClick={() => removeFromCart(c.product.id)}>
                            <X size={13} style={{ color: 'rgba(23,24,45,0.3)' }} />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </AnimatePresence>

                <div className="pt-4 mb-4" style={{ borderTop: '1px solid rgba(23,24,45,0.07)' }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[13px]" style={{ color: 'rgba(23,24,45,0.5)' }}>합계</span>
                    <span className="font-bold text-[16px]" style={{ color: '#17182D' }}>{totalPrice.toLocaleString()}원</span>
                  </div>
                  <p className="text-[12px]" style={{ color: 'rgba(23,24,45,0.35)' }}>결제는 픽업 시 현장에서 진행됩니다</p>
                </div>

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="요청사항 (선택)"
                  rows={2}
                  className="w-full text-[13px] resize-none mb-4 px-3 py-2.5 focus:outline-none leading-relaxed placeholder:text-neutral-300"
                  style={{ border: '1px solid rgba(23,24,45,0.15)', borderRadius: 10, color: '#17182D' }}
                />

                <motion.button
                  onClick={handleReserve}
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  className="w-full py-3.5 font-bold text-[15px] text-white disabled:opacity-50"
                  style={{ background: '#17182D', borderRadius: 12 }}
                >
                  {loading ? '예약 중...' : isLoggedIn ? '예약 완료하기' : '로그인 후 예약하기'}
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
