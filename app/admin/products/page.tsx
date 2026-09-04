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
      <h1 className="text-2xl font-bold text-gray-800 mb-1">상품 관리</h1>
      <p className="text-sm text-gray-400 mb-8">판매할 과일 상품을 등록하고 관리하세요.</p>
      <ProductManager initialProducts={(products as Product[]) ?? []} />
    </div>
  )
}
