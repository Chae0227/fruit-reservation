'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

const EASE = [0.32, 0.72, 0, 1] as const

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
    <div className="min-h-screen flex" style={{ background: '#F8F8F5' }}>
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16" style={{ background: '#FFF0E5' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#F97316' }}>과일가게</p>
          <h2 className="text-4xl font-bold leading-tight mb-4" style={{ color: '#17182D', letterSpacing: '-0.025em' }}>
            신선한 과일을<br />미리 예약하세요
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(23,24,45,0.5)' }}>
            실명 예약으로 대기 없이<br />편하게 픽업하실 수 있습니다.
          </p>
          <div className="mt-10 space-y-3">
            {['매일 직접 선별한 신선한 과일', '실명 예약으로 노쇼 없는 신뢰', '픽업 시 현장 결제로 간편하게'].map((t) => (
              <div key={t} className="flex items-center gap-2.5 text-[14px]" style={{ color: 'rgba(23,24,45,0.55)' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#F97316' }} />
                {t}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: EASE }}
        >
          <Link href="/" className="text-[13px] mb-10 inline-block transition-opacity hover:opacity-60" style={{ color: 'rgba(23,24,45,0.45)' }}>
            ← 홈으로
          </Link>
          <h1 className="text-[26px] font-bold mb-1" style={{ color: '#17182D', letterSpacing: '-0.02em' }}>로그인</h1>
          <p className="text-[14px] mb-8" style={{ color: 'rgba(23,24,45,0.45)' }}>계정에 로그인해주세요.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: '전화번호', type: 'tel',      value: phone,    onChange: setPhone,    placeholder: '01012345678' },
              { label: '비밀번호', type: 'password', value: password, onChange: setPassword, placeholder: '' },
            ].map(({ label, type, value, onChange, placeholder }) => (
              <div key={label}>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: '#17182D' }}>{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  required
                  className="w-full px-4 py-3 text-[15px] focus:outline-none transition-all"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(23,24,45,0.15)',
                    borderRadius: 12,
                    color: '#17182D',
                  }}
                />
              </div>
            ))}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 text-[13px]"
                style={{ background: '#FFF0E5', borderRadius: 10, color: '#c2410c' }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              className="w-full py-3.5 font-bold text-[15px] text-white disabled:opacity-50 mt-1"
              style={{ background: '#F97316', borderRadius: 12 }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </motion.button>
          </form>

          <p className="text-center text-[13px] mt-8" style={{ color: 'rgba(23,24,45,0.45)' }}>
            계정이 없으신가요?{' '}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: '#17182D' }}>
              회원가입
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
