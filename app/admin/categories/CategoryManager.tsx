'use client'

import { useState } from 'react'
import { GripVertical, Pencil, Trash2, Plus, Check, X } from 'lucide-react'
import type { Category } from '@/lib/types'

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setLoading(true)
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), sort_order: categories.length }),
    })
    if (res.ok) {
      const created = await res.json()
      setCategories((prev) => [...prev, created])
      setNewName('')
    }
    setLoading(false)
  }

  async function handleEdit(id: string) {
    if (!editName.trim()) return
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim() }),
    })
    if (res.ok) {
      const updated = await res.json()
      setCategories((prev) => prev.map((c) => c.id === id ? updated : c))
      setEditId(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('카테고리를 삭제하면 해당 상품들의 카테고리가 해제됩니다. 계속할까요?')) return
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const inputStyle = {
    border: '1px solid rgba(23,24,45,0.15)',
    borderRadius: 10,
    color: '#17182D',
    background: '#FFFFFF',
  }

  return (
    <div className="max-w-lg">
      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="새 카테고리 이름 (예: 포도류)"
          className="flex-1 px-4 py-2.5 text-[14px] focus:outline-none"
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={loading || !newName.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-white rounded-xl disabled:opacity-50 transition-opacity hover:opacity-80"
          style={{ background: '#F97316' }}
        >
          <Plus size={14} /> 추가
        </button>
      </form>

      {/* Category list */}
      <div className="rounded-[20px] overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(23,24,45,0.06)' }}>
        {categories.length === 0 ? (
          <p className="text-center py-10 text-[14px]" style={{ color: 'rgba(23,24,45,0.35)' }}>
            아직 카테고리가 없습니다. 추가해주세요.
          </p>
        ) : (
          <ul>
            {categories.map((cat, idx) => (
              <li
                key={cat.id}
                className="flex items-center gap-3 px-5 py-3.5"
                style={{ borderBottom: idx < categories.length - 1 ? '1px solid rgba(23,24,45,0.05)' : undefined }}
              >
                <GripVertical size={14} style={{ color: 'rgba(23,24,45,0.25)', flexShrink: 0 }} />

                {editId === cat.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    className="flex-1 px-3 py-1.5 text-[14px] focus:outline-none"
                    style={{ ...inputStyle, borderRadius: 8 }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleEdit(cat.id); if (e.key === 'Escape') setEditId(null) }}
                  />
                ) : (
                  <span className="flex-1 text-[14px] font-medium" style={{ color: '#17182D' }}>{cat.name}</span>
                )}

                <div className="flex items-center gap-2 shrink-0">
                  {editId === cat.id ? (
                    <>
                      <button onClick={() => handleEdit(cat.id)}>
                        <Check size={15} style={{ color: '#15803d' }} />
                      </button>
                      <button onClick={() => setEditId(null)}>
                        <X size={15} style={{ color: 'rgba(23,24,45,0.4)' }} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditId(cat.id); setEditName(cat.name) }}>
                        <Pencil size={14} style={{ color: '#F97316' }} />
                      </button>
                      <button onClick={() => handleDelete(cat.id)}>
                        <Trash2 size={14} style={{ color: '#ef4444' }} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
