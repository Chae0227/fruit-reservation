import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()

  if (session.role === 'admin') {
    const { data, error } = await supabase
      .from('reservations')
      .select('*, users(name, phone), reservation_items(*, products(name, price))')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from('reservations')
    .select('*, reservation_items(*, products(name, price))')
    .eq('user_id', session.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { items, note } = await request.json()
  if (!items?.length) {
    return NextResponse.json({ error: '상품을 선택해주세요.' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data: reservation, error: resError } = await supabase
    .from('reservations')
    .insert({ user_id: session.id, note })
    .select()
    .single()

  if (resError || !reservation) {
    return NextResponse.json({ error: '예약 중 오류가 발생했습니다.' }, { status: 500 })
  }

  const itemRows = items.map((item: { product_id: string; quantity: number }) => ({
    reservation_id: reservation.id,
    product_id: item.product_id,
    quantity: item.quantity,
  }))

  const { error: itemError } = await supabase.from('reservation_items').insert(itemRows)
  if (itemError) {
    await supabase.from('reservations').delete().eq('id', reservation.id)
    return NextResponse.json({ error: '예약 중 오류가 발생했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: reservation.id }, { status: 201 })
}
