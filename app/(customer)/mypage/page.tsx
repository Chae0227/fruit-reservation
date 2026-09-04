import { createServerClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { ClipboardList } from 'lucide-react'
import type { Reservation } from '@/lib/types'

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:   { label: '대기중',  className: 'bg-amber-50 text-amber-600' },
  confirmed: { label: '확인됨',  className: 'bg-blue-50 text-blue-600' },
  completed: { label: '완료',    className: 'bg-green-50 text-green-600' },
  cancelled: { label: '취소',    className: 'bg-neutral-100 text-neutral-400' },
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
    <div className="max-w-2xl mx-auto px-5 py-14">
      <div className="mb-10">
        <p className="text-xs font-semibold text-orange-500 tracking-widest uppercase mb-2">My Reservations</p>
        <h1 className="text-2xl font-bold text-neutral-900">내 예약 내역</h1>
        <p className="text-sm text-neutral-400 mt-1">{session.name}님의 예약 목록입니다.</p>
      </div>

      {!reservations?.length ? (
        <div className="text-center py-24 text-neutral-400">
          <ClipboardList size={36} className="mx-auto mb-4 opacity-25" />
          <p className="text-sm">아직 예약 내역이 없습니다.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {(reservations as Reservation[]).map((r) => {
            const status = statusConfig[r.status] ?? statusConfig.pending
            const total = r.reservation_items?.reduce(
              (sum, item) => sum + (item.products?.price ?? 0) * item.quantity, 0
            ) ?? 0

            return (
              <li key={r.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:border-neutral-200 hover:shadow-sm transition-all">
                <div className="px-5 py-4 border-b border-neutral-50 flex items-center justify-between">
                  <span className="font-mono text-xs text-neutral-400 tracking-wider">
                    #{r.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <div className="px-5 py-4">
                  <ul className="space-y-2">
                    {r.reservation_items?.map((item) => (
                      <li key={item.id} className="flex justify-between items-center text-[14px]">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-700 font-medium">{item.products?.name}</span>
                          <span className="text-neutral-400 text-xs">× {item.quantity}</span>
                        </div>
                        <span className="text-neutral-600 font-medium">
                          {((item.products?.price ?? 0) * item.quantity).toLocaleString()}원
                        </span>
                      </li>
                    ))}
                  </ul>

                  {r.note && (
                    <div className="mt-3 pt-3 border-t border-neutral-50">
                      <p className="text-xs text-neutral-400">요청사항: {r.note}</p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between items-center">
                    <span className="text-xs text-neutral-400">
                      {new Date(r.created_at).toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="font-bold text-neutral-900">{total.toLocaleString()}원</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
