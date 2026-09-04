import { createServerClient } from '@/lib/supabase/server'
import ReservationManager from './ReservationManager'

export default async function AdminReservationsPage() {
  const supabase = createServerClient()
  const { data: reservations } = await supabase
    .from('reservations')
    .select('*, users(name, phone), reservation_items(*, products(name, price))')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">예약 관리</h1>
      <p className="text-sm text-gray-400 mb-8">예약 현황을 확인하고 상태를 변경하세요.</p>
      <ReservationManager initialReservations={reservations ?? []} />
    </div>
  )
}
