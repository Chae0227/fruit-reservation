'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#faf8f4' }}>
      <div className="hidden lg:block flex-1 relative overflow-hidden" style={{ background: 'linear-gradient(155deg, #1c1c1c, #2e1a0e)' }}>
        <div className="absolute inset-0 flex flex-col justify-center px-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-orange-400 mb-4">과일가게</p>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            1분이면<br />시작할 수 있어요
          </h2>
          <ul className="space-y-3 text-neutral-400 text-[15px]">
            {['이름과 연락처만 입력하면 완료', '로그인 후 바로 예약 가능', '픽업 시 현장 결제'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-700 mb-10 inline-block transition-colors">
            ← 홈으로
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">회원가입</h1>
          <p className="text-sm text-neutral-400 mb-8">간단하게 가입하고 바로 예약하세요.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                required
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-neutral-400 bg-white transition-colors placeholder:text-neutral-300"
              />
            </div>
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
                placeholder="6자 이상"
                required
                minLength={6}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-neutral-400 bg-white transition-colors placeholder:text-neutral-300"
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
              {loading ? '가입 중...' : '가입하기'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-400 mt-8">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-semibold text-neutral-800 hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
