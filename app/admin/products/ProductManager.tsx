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
    setForm({
      name: p.name,
      description: p.description ?? '',
      price: String(p.price),
      image_url: p.image_url ?? '',
      is_available: p.is_available,
    })
  }

  function cancelEdit() {
    setEditId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const body = { ...form, price: Number(form.price) }

    if (editId) {
      const res = await fetch(`/api/products/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const updated = await res.json()
        setProducts((prev) => prev.map((p) => p.id === editId ? updated : p))
        cancelEdit()
      }
    } else {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const created = await res.json()
        setProducts((prev) => [created, ...prev])
        setForm(emptyForm)
      }
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('삭제하시겠습니까?')) return
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  async function toggleAvailable(p: Product) {
    const res = await fetch(`/api/products/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_available: !p.is_available }),
    })
    if (res.ok) {
      const updated = await res.json()
      setProducts((prev) => prev.map((x) => x.id === p.id ? updated : x))
    }
  }

  return (
    <div className="flex gap-8">
      {/* Form */}
      <div className="w-72 shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-4">{editId ? '상품 수정' : '상품 추가'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">상품명 *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">설명</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">가격 (원) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                min={0}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">이미지 URL</label>
              <input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_available}
                onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                className="rounded"
              />
              판매 중
            </label>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {editId ? '수정' : '추가'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Product list */}
      <div className="flex-1">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-50">
                <th className="px-5 py-3 text-left font-medium">상품명</th>
                <th className="px-5 py-3 text-left font-medium">가격</th>
                <th className="px-5 py-3 text-left font-medium">상태</th>
                <th className="px-5 py-3 text-left font-medium">액션</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{p.name}</p>
                    {p.description && <p className="text-xs text-gray-400 truncate max-w-xs">{p.description}</p>}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{p.price.toLocaleString()}원</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleAvailable(p)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        p.is_available
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {p.is_available ? '판매중' : '숨김'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!products.length && (
            <p className="text-center py-10 text-gray-400 text-sm">등록된 상품이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  )
}
