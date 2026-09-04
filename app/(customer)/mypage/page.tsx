import { createServerClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import type { Reservation } from '@/lib/types'

const statusLabel: Record<string, string> = {
  pending: '대기중',
  confirmed: '확인됨',
  completed: '완료',
  cancelled: '취소',
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-stone-100 text-stone-500',
}

export default async function MyPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const supabase = createServerClient()
  const { data: reservations } = await supabase
    .from('reservations')
    .select('*, reservation_items(*, products(name, price))')
    .eq('user_id', session.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-800 mb-1">내 예약 내역</h1>
      <p className="text-stone-400 text-sm mb-8">{session.name}님의 예약 목록입니다.</p>

      {!reservations?.length ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-4xl mb-4">📋</p>
          <p>예약 내역이 없습니다.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {(reservations as Reservation[]).map((r) => (
            <li key={r.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-stone-400">{r.id.slice(0, 8).toUpperCase()}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[r.status]}`}>
                  {statusLabel[r.status]}
                </span>
              </div>
              <ul className="space-y-1 mb-3">
                {r.reservation_items?.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm text-stone-700">
                    <span>{item.products?.name} × {item.quantity}</span>
                    <span className="text-stone-500">{((item.products?.price ?? 0) * item.quantity).toLocaleString()}원</span>
                  </li>
                ))}
              </ul>
              {r.note && <p className="text-xs text-stone-400 border-t border-stone-50 pt-2">요청: {r.note}</p>}
              <p className="text-xs text-stone-300 mt-2 text-right">
                {new Date(r.created_at).toLocaleString('ko-KR')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
