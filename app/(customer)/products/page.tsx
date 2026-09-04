import { createServerClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'
import type { Product } from '@/lib/types'
import ProductList from './ProductList'

export default async function ProductsPage() {
  const supabase = createServerClient()
  const [{ data: products }, session] = await Promise.all([
    supabase.from('products').select('*').eq('is_available', true).order('created_at', { ascending: false }),
    getSession(),
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">예약 상품</h1>
      <p className="text-stone-500 text-sm mb-8">원하는 상품을 선택하고 수량을 지정한 뒤 예약해주세요.</p>
      <ProductList products={(products as Product[]) ?? []} isLoggedIn={!!session} />
    </div>
  )
}
