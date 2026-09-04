'use client'

import { useState } from 'react'
import type { Product } from '@/lib/types'

type Form = { name: string; description: string; price: string; image_url: string; is_available: boolean }

const emptyForm: Form = { name: '', description: '', price: '', image_url: '', is_available: true }

export default function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [form, setForm] = useState<Form>(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function startEdit(p: Product) {
    setEditId(p.id)
    setForm({ name: p.name, description: p.description ?? '', price: String(p.price), image_url: p.image_url ?? '', is_available: p.is_available })
  }

  function cancelEdit() { setEditId(null); setForm(emptyForm) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const body = { ...form, price: Number(form.price) }
    if (editId) {
      const res = await fetch(`/api/products/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { const updated = await res.json(); setProducts((prev) => prev.map((p) => p.id === editId ? updated : p)); cancelEdit() }
    } else {
      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { const created = await res.json(); setProducts((prev) => [created, ...prev]); setForm(emptyForm) }
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('삭제하시겠습니까?')) return
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  async function toggleAvailable(p: Product) {
    const res = await fetch(`/api/products/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_available: !p.is_available }) })
    if (res.ok) { const updated = await res.json(); setProducts((prev) => prev.map((x) => x.id === p.id ? updated : x)) }
  }

  const inputStyle = { border: '1px solid rgba(23,24,45,0.15)', borderRadius: 10, color: '#17182D', background: '#FFFFFF' }

  return (
    <div className="flex gap-8">
      {/* Form */}
      <div className="w-72 shrink-0">
        <div className="rounded-[20px] p-5" style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(23,24,45,0.06)' }}>
          <h2 className="font-semibold text-[14px] mb-4" style={{ color: '#17182D' }}>{editId ? '상품 수정' : '상품 추가'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { label: '상품명 *', key: 'name', type: 'text', required: true },
              { label: '이미지 URL', key: 'image_url', type: 'text', placeholder: 'https://...' },
            ].map(({ label, key, type, required, placeholder }) => (
              <div key={key}>
                <label className="block text-[12px] font-medium mb-1" style={{ color: 'rgba(23,24,45,0.5)' }}>{label}</label>
                <input
                  type={type}
                  value={(form as Record<string, string | boolean>)[key] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={required}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-[14px] focus:outline-none"
                  style={inputStyle}
                />
              </div>
            ))}
            <div>
              <label className="block text-[12px] font-medium mb-1" style={{ color: 'rgba(23,24,45,0.5)' }}>설명</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 text-[14px] focus:outline-none resize-none"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1" style={{ color: 'rgba(23,24,45,0.5)' }}>가격 (원) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                min={0}
                className="w-full px-3 py-2 text-[14px] focus:outline-none"
                style={inputStyle}
              />
            </div>
            <label className="flex items-center gap-2 text-[13px] cursor-pointer" style={{ color: 'rgba(23,24,45,0.6)' }}>
              <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} />
              판매 중
            </label>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 text-white text-[13px] font-semibold rounded-xl transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ background: '#F97316' }}
              >
                {loading ? '저장 중...' : editId ? '수정' : '추가'}
              </button>
              {editId && (
                <button type="button" onClick={cancelEdit} className="px-4 py-2 text-[13px] rounded-xl" style={{ border: '1px solid rgba(23,24,45,0.12)', color: 'rgba(23,24,45,0.5)' }}>
                  취소
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Product list */}
      <div className="flex-1">
        <div className="rounded-[20px] overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(23,24,45,0.06)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(23,24,45,0.05)' }}>
                {['상품명', '가격', '상태', '액션'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[12px] font-medium" style={{ color: 'rgba(23,24,45,0.4)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(23,24,45,0.04)' }}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-[14px]" style={{ color: '#17182D' }}>{p.name}</p>
                    {p.description && <p className="text-[12px] truncate max-w-xs" style={{ color: 'rgba(23,24,45,0.4)' }}>{p.description}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-[14px]" style={{ color: '#17182D' }}>{p.price.toLocaleString()}원</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleAvailable(p)}
                      className="text-[12px] px-2.5 py-1 rounded-full font-medium"
                      style={p.is_available
                        ? { background: '#E5F3E9', color: '#15803d' }
                        : { background: 'rgba(23,24,45,0.06)', color: 'rgba(23,24,45,0.4)' }
                      }
                    >
                      {p.is_available ? '판매중' : '숨김'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(p)} className="text-[12px] font-medium" style={{ color: '#F97316' }}>수정</button>
                      <button onClick={() => handleDelete(p.id)} className="text-[12px] font-medium" style={{ color: '#ef4444' }}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!products.length && (
            <p className="text-center py-10 text-[14px]" style={{ color: 'rgba(23,24,45,0.35)' }}>등록된 상품이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  )
}
