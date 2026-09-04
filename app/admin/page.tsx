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
    { label: '전체 예약', value: totalReservations ?? 0, Icon: CalendarCheck, bg: '#DCEBFF', color: '#1d4ed8' },
    { label: '대기중',    value: pendingCount ?? 0,      Icon: Clock,         bg: '#FFF4B8', color: '#92400e' },
    { label: '판매중 상품', value: productCount ?? 0,    Icon: Boxes,         bg: '#E5F3E9', color: '#15803d' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[12px] font-semibold tracking-widest uppercase mb-1" style={{ color: '#F97316' }}>Overview</p>
        <h1 className="text-[22px] font-bold" style={{ color: '#17182D', letterSpacing: '-0.02em' }}>대시보드</h1>
        <p className="text-[13px] mt-0.5" style={{ color: 'rgba(23,24,45,0.4)' }}>예약 현황을 확인하세요.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[20px] p-5 flex items-center gap-4"
            style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(23,24,45,0.06)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>
              <s.Icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-[12px]" style={{ color: 'rgba(23,24,45,0.4)' }}>{s.label}</p>
              <p className="text-[26px] font-bold leading-tight" style={{ color: s.color }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[20px] overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(23,24,45,0.06)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(23,24,45,0.06)' }}>
          <h2 className="text-[14px] font-semibold" style={{ color: '#17182D' }}>최근 예약</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(23,24,45,0.05)' }}>
              {['예약번호', '이름', '연락처', '상품', '일시'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[12px] font-medium" style={{ color: 'rgba(23,24,45,0.4)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent?.map((r) => (
              <tr key={r.id} className="transition-colors" style={{ borderBottom: '1px solid rgba(23,24,45,0.04)' }}>
                <td className="px-5 py-3 font-mono text-[12px]" style={{ color: 'rgba(23,24,45,0.35)' }}>{r.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-5 py-3 font-medium text-[14px]" style={{ color: '#17182D' }}>{r.users?.name}</td>
                <td className="px-5 py-3 text-[13px]" style={{ color: 'rgba(23,24,45,0.5)' }}>{r.users?.phone}</td>
                <td className="px-5 py-3 text-[12px]" style={{ color: 'rgba(23,24,45,0.5)' }}>
                  {r.reservation_items?.map((item: { products?: { name: string }; quantity: number }) =>
                    `${item.products?.name} ×${item.quantity}`
                  ).join(', ')}
                </td>
                <td className="px-5 py-3 text-[12px]" style={{ color: 'rgba(23,24,45,0.35)' }}>{new Date(r.created_at).toLocaleString('ko-KR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!recent?.length && (
          <p className="text-center py-10 text-[14px]" style={{ color: 'rgba(23,24,45,0.35)' }}>예약 내역이 없습니다.</p>
        )}
      </div>
    </div>
  )
}
