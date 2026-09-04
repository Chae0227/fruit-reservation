'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    router.push(data.role === 'admin' ? '/admin' : '/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#faf8f4' }}>
      <div className="hidden lg:block flex-1 relative overflow-hidden" style={{ background: 'linear-gradient(155deg, #1c1c1c, #2e1a0e)' }}>
        <div className="absolute inset-0 flex flex-col justify-center px-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-orange-400 mb-4">과일가게</p>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            신선한 과일을<br />미리 예약하세요
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            실명 예약으로 대기 없이<br />편하게 픽업하실 수 있습니다.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-700 mb-10 inline-block transition-colors">
            ← 홈으로
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">로그인</h1>
          <p className="text-sm text-neutral-400 mb-8">계정에 로그인해주세요.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">전화번호</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01012345678"
                required
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-neutral-400 bg-white transition-colors placeholder:text-neutral-300"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-neutral-400 bg-white transition-colors"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-[15px] text-white transition-all disabled:opacity-50 hover:opacity-90 mt-2"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-400 mt-8">
            계정이 없으신가요?{' '}
            <Link href="/register" className="font-semibold text-neutral-800 hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
