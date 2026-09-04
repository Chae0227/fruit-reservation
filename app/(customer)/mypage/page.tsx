import { createServerClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { ClipboardList } from 'lucide-react'
import { MotionReveal, MotionStagger, MotionItem } from '@/components/motion/MotionReveal'
import type { Reservation } from '@/lib/types'

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  pending:   { label: '대기중', bg: '#FFF4B8', color: '#92400e' },
  confirmed: { label: '확인됨', bg: '#DCEBFF', color: '#1d4ed8' },
  completed: { label: '완료',   bg: '#E5F3E9', color: '#15803d' },
  cancelled: { label: '취소',   bg: '#F3F4F6', color: '#6b7280' },
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
    <div className="max-w-2xl mx-auto px-10 py-14">
      <MotionReveal>
        <p className="text-[12px] font-semibold tracking-widest uppercase mb-2" style={{ color: '#F97316' }}>My Reservations</p>
        <h1 className="text-[26px] font-bold mb-1" style={{ color: '#17182D', letterSpacing: '-0.02em' }}>내 예약 내역</h1>
        <p className="text-[14px] mb-10" style={{ color: 'rgba(23,24,45,0.45)' }}>{session.name}님의 예약 목록입니다.</p>
      </MotionReveal>

      {!reservations?.length ? (
        <MotionReveal delay={0.1}>
          <div className="text-center py-24" style={{ color: 'rgba(23,24,45,0.3)' }}>
            <ClipboardList size={32} className="mx-auto mb-4 opacity-30" />
            <p className="text-[14px]">아직 예약 내역이 없습니다.</p>
          </div>
        </MotionReveal>
      ) : (
        <MotionStagger className="space-y-4">
          {(reservations as Reservation[]).map((r) => {
            const st = STATUS[r.status] ?? STATUS.pending
            const total = r.reservation_items?.reduce(
              (s, item) => s + (item.products?.price ?? 0) * item.quantity, 0
            ) ?? 0

            return (
              <MotionItem key={r.id}>
                <div className="rounded-[20px] overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(23,24,45,0.06)' }}>
                  <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(23,24,45,0.06)' }}>
                    <span className="font-mono text-[12px] tracking-wider" style={{ color: 'rgba(23,24,45,0.35)' }}>
                      #{r.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span
                      className="text-[12px] font-semibold px-3 py-1"
                      style={{ background: st.bg, color: st.color, borderRadius: 8 }}
                    >
                      {st.label}
                    </span>
                  </div>
                  <div className="px-5 py-4">
                    <ul className="space-y-2 mb-4">
                      {r.reservation_items?.map((item) => (
                        <li key={item.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-medium" style={{ color: '#17182D' }}>{item.products?.name}</span>
                            <span className="text-[12px]" style={{ color: 'rgba(23,24,45,0.4)' }}>× {item.quantity}</span>
                          </div>
                          <span className="text-[14px] font-medium" style={{ color: 'rgba(23,24,45,0.6)' }}>
                            {((item.products?.price ?? 0) * item.quantity).toLocaleString()}원
                          </span>
                        </li>
                      ))}
                    </ul>
                    {r.note && (
                      <p className="text-[12px] mb-4" style={{ color: 'rgba(23,24,45,0.4)' }}>요청: {r.note}</p>
                    )}
                    <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid rgba(23,24,45,0.06)' }}>
                      <span className="text-[12px]" style={{ color: 'rgba(23,24,45,0.35)' }}>
                        {new Date(r.created_at).toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="font-bold text-[15px]" style={{ color: '#17182D' }}>{total.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </MotionItem>
            )
          })}
        </MotionStagger>
      )}
    </div>
  )
}
