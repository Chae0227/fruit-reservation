'use client'

import { useState } from 'react'
import { Download, Trash2 } from 'lucide-react'
import type { Reservation, ReservationStatus } from '@/lib/types'

const statusOptions: { value: ReservationStatus; label: string; color: string }[] = [
  { value: 'pending', label: '대기중', color: 'bg-amber-50 text-amber-700' },
  { value: 'confirmed', label: '확인됨', color: 'bg-blue-50 text-blue-700' },
  { value: 'completed', label: '완료', color: 'bg-green-50 text-green-700' },
  { value: 'cancelled', label: '취소', color: 'bg-gray-100 text-gray-500' },
]

const filterTabs: { value: ReservationStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기중' },
  { value: 'confirmed', label: '확인됨' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소' },
]

export default function ReservationManager({ initialReservations }: { initialReservations: Reservation[] }) {
  const [reservations, setReservations] = useState(initialReservations)
  const [filter, setFilter] = useState<ReservationStatus | 'all'>('all')
  const [resetting, setResetting] = useState(false)

  async function updateStatus(id: string, status: ReservationStatus) {
    const res = await fetch(`/api/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))
  }

  async function handleExport() {
    const res = await fetch('/api/reservations/export')
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reservations_${Date.now()}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleReset() {
    if (!confirm('모든 예약 내역을 삭제하시겠습니까?\n엑셀 다운로드를 먼저 진행하세요.')) return
    setResetting(true)
    const res = await fetch('/api/reservations/reset', { method: 'DELETE' })
    if (res.ok) setReservations([])
    setResetting(false)
  }

  const filtered = filter === 'all' ? reservations : reservations.filter((r) => r.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(23,24,45,0.06)' }}>
          {filterTabs.map((tab) => {
            const count = tab.value === 'all' ? reservations.length : reservations.filter((r) => r.status === tab.value).length
            const active = filter === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all"
                style={active
                  ? { background: '#FFFFFF', color: '#17182D', boxShadow: '0 1px 4px rgba(23,24,45,0.1)' }
                  : { color: 'rgba(23,24,45,0.45)' }
                }
              >
                {tab.label} <span className="ml-1" style={{ color: 'rgba(23,24,45,0.3)' }}>{count}</span>
              </button>
            )
          })}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors"
            style={{ background: '#FFFFFF', border: '1px solid rgba(23,24,45,0.12)', color: 'rgba(23,24,45,0.6)' }}
          >
            <Download size={13} />
            엑셀 다운로드
          </button>
          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
            style={{ background: '#FFFFFF', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
          >
            <Trash2 size={13} />
            내역 초기화
          </button>
        </div>
      </div>

      <div className="rounded-[20px] overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(23,24,45,0.06)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(23,24,45,0.05)' }}>
              {['예약번호', '이름', '연락처', '상품', '금액', '상태', '일시'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[12px] font-medium" style={{ color: 'rgba(23,24,45,0.4)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const total = r.reservation_items?.reduce(
                (sum, item) => sum + (item.products?.price ?? 0) * item.quantity, 0
              ) ?? 0
              const currentStatus = statusOptions.find((s) => s.value === r.status)
              return (
                <tr key={r.id} style={{ borderBottom: '1px solid rgba(23,24,45,0.04)' }}>
                  <td className="px-5 py-3.5 font-mono text-[12px]" style={{ color: 'rgba(23,24,45,0.35)' }}>{r.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-3.5 font-medium text-[14px]" style={{ color: '#17182D' }}>{r.users?.name}</td>
                  <td className="px-5 py-3.5 text-[13px]" style={{ color: 'rgba(23,24,45,0.5)' }}>{r.users?.phone}</td>
                  <td className="px-5 py-3.5 text-[12px]" style={{ color: 'rgba(23,24,45,0.5)' }}>
                    {r.reservation_items?.map((item) => `${item.products?.name} ×${item.quantity}`).join(', ')}
                    {r.note && <span className="block mt-0.5" style={{ color: 'rgba(23,24,45,0.3)' }}>{r.note}</span>}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-[13px]" style={{ color: '#17182D' }}>{total.toLocaleString()}원</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value as ReservationStatus)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${currentStatus?.color}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-[12px] whitespace-nowrap" style={{ color: 'rgba(23,24,45,0.35)' }}>{new Date(r.created_at).toLocaleString('ko-KR')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!filtered.length && (
          <p className="text-center py-12 text-[14px]" style={{ color: 'rgba(23,24,45,0.35)' }}>예약 내역이 없습니다.</p>
        )}
      </div>
    </div>
  )
}
