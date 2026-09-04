import { createServerClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types'
import ProductManager from './ProductManager'

export default async function AdminProductsPage() {
  const supabase = createServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <p className="text-[12px] font-semibold tracking-widest uppercase mb-1" style={{ color: '#F97316' }}>Products</p>
      <h1 className="text-[22px] font-bold mb-1" style={{ color: '#17182D', letterSpacing: '-0.02em' }}>상품 관리</h1>
      <p className="text-[13px] mb-8" style={{ color: 'rgba(23,24,45,0.4)' }}>판매할 과일 상품을 등록하고 관리하세요.</p>
      <ProductManager initialProducts={(products as Product[]) ?? []} />
    </div>
  )
}
