import { createServerClient } from '@/lib/supabase/server'
import type { Category } from '@/lib/types'
import CategoryManager from './CategoryManager'

export default async function AdminCategoriesPage() {
  const supabase = createServerClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  return (
    <div className="p-8">
      <p className="text-[12px] font-semibold tracking-widest uppercase mb-1" style={{ color: '#F5A623' }}>Categories</p>
      <h1 className="text-[22px] font-bold mb-1" style={{ color: '#17182D', letterSpacing: '-0.02em' }}>카테고리 관리</h1>
      <p className="text-[13px] mb-8" style={{ color: 'rgba(23,24,45,0.4)' }}>
        포도류, 감귤류처럼 과일 종류별로 카테고리를 만들고 상품에 배정하세요.
      </p>
      <CategoryManager initialCategories={(categories as Category[]) ?? []} />
    </div>
  )
}
