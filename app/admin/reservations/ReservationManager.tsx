'use client'

import { useState } from 'react'
import type { Reservation, ReservationStatus } from '@/lib/types'

const statusOptions: { value: ReservationStatus; label: string; color: string }[] = [
  { value: 'pending', label: '대기중', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'confirmed', label: '확인됨', color: 'bg-blue-100 text-blue-700' },
  { value: 'completed', label: '완료', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: '취소', color: 'bg-gray-100 text-gray-500' },
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
    if (res.ok) {
      setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))
    }
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
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            전체 ({reservations.length})
          </button>
          {statusOptions.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${filter === s.value ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {s.label} ({reservations.filter((r) => r.status === s.value).length})
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            📥 엑셀 다운로드
          </button>
          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            🗑 내역 초기화
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-gray-50">
              <th className="px-5 py-3 text-left font-medium">예약번호</th>
              <th className="px-5 py-3 text-left font-medium">이름</th>
              <th className="px-5 py-3 text-left font-medium">연락처</th>
              <th className="px-5 py-3 text-left font-medium">상품</th>
              <th className="px-5 py-3 text-left font-medium">금액</th>
              <th className="px-5 py-3 text-left font-medium">상태</th>
              <th className="px-5 py-3 text-left font-medium">일시</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const total = r.reservation_items?.reduce(
                (sum, item) => sum + (item.products?.price ?? 0) * item.quantity, 0
              ) ?? 0
              const currentStatus = statusOptions.find((s) => s.value === r.status)
              return (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">{r.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{r.users?.name}</td>
                  <td className="px-5 py-3 text-gray-500">{r.users?.phone}</td>
                  <td className="px-5 py-3 text-gray-600 text-xs">
                    {r.reservation_items?.map((item) =>
                      `${item.products?.name} ×${item.quantity}`
                    ).join(', ')}
                    {r.note && <p className="text-gray-400 mt-0.5">메모: {r.note}</p>}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-700">{total.toLocaleString()}원</td>
                  <td className="px-5 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value as ReservationStatus)}
                      className={`text-xs font-medium px-2 py-1 rounded-lg border-0 focus:outline-none cursor-pointer ${currentStatus?.color}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{new Date(r.created_at).toLocaleString('ko-KR')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!filtered.length && (
          <p className="text-center py-10 text-gray-400 text-sm">예약 내역이 없습니다.</p>
        )}
      </div>
    </div>
  )
}
