import { createServerClient } from '@/lib/supabase/server'
import { CalendarCheck, Clock, Boxes } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = createServerClient()
  const [
    { count: totalReservations },
    { count: pendingCount },
    { count: productCount },
    { data: recent },
  ] = await Promise.all([
    supabase.from('reservations').select('*', { count: 'exact', head: true }),
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_available', true),
    supabase
      .from('reservations')
      .select('*, users(name, phone), reservation_items(quantity, products(name))')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    { label: '전체 예약', value: totalReservations ?? 0, Icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '대기중', value: pendingCount ?? 0, Icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: '판매중 상품', value: productCount ?? 0, Icon: Boxes, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">대시보드</h1>
        <p className="text-sm text-gray-400 mt-0.5">예약 현황을 확인하세요.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
              <s.Icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color} leading-tight`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">최근 예약</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-gray-50">
              <th className="px-5 py-3 text-left font-medium">예약번호</th>
              <th className="px-5 py-3 text-left font-medium">이름</th>
              <th className="px-5 py-3 text-left font-medium">연락처</th>
              <th className="px-5 py-3 text-left font-medium">상품</th>
              <th className="px-5 py-3 text-left font-medium">일시</th>
            </tr>
          </thead>
          <tbody>
            {recent?.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-gray-400">{r.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-5 py-3 font-medium text-gray-800">{r.users?.name}</td>
                <td className="px-5 py-3 text-gray-500">{r.users?.phone}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">
                  {r.reservation_items?.map((item: { products?: { name: string }; quantity: number }) =>
                    `${item.products?.name} ×${item.quantity}`
                  ).join(', ')}
                </td>
                <td className="px-5 py-3 text-gray-400 text-xs">{new Date(r.created_at).toLocaleString('ko-KR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!recent?.length && (
          <p className="text-center py-10 text-gray-400 text-sm">예약 내역이 없습니다.</p>
        )}
      </div>
    </div>
  )
}
