'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

const EASE = [0.32, 0.72, 0, 1] as const

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
    <div className="min-h-screen flex" style={{ background: '#F8F8F5' }}>
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16" style={{ background: '#17182D' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#F97316' }}>과일가게</p>
          <h2 className="text-4xl font-bold text-white leading-tight mb-6" style={{ letterSpacing: '-0.025em' }}>
            1분이면<br />시작할 수 있어요
          </h2>
          <ul className="space-y-3">
            {['이름과 연락처만 입력하면 완료', '로그인 후 바로 예약 가능', '픽업 시 현장 결제'].map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-[15px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#F97316' }} />
                {t}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

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
          <h1 className="text-[26px] font-bold mb-1" style={{ color: '#17182D', letterSpacing: '-0.02em' }}>회원가입</h1>
          <p className="text-[14px] mb-8" style={{ color: 'rgba(23,24,45,0.45)' }}>간단하게 가입하고 바로 예약하세요.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: '이름',    type: 'text',     value: name,     onChange: setName,     placeholder: '홍길동' },
              { label: '전화번호', type: 'tel',      value: phone,    onChange: setPhone,    placeholder: '01012345678' },
              { label: '비밀번호', type: 'password', value: password, onChange: setPassword, placeholder: '6자 이상' },
            ].map(({ label, type, value, onChange, placeholder }) => (
              <div key={label}>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: '#17182D' }}>{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  required
                  minLength={type === 'password' ? 6 : undefined}
                  className="w-full px-4 py-3 text-[15px] focus:outline-none transition-all"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(23,24,45,0.15)', borderRadius: 12, color: '#17182D' }}
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
              {loading ? '가입 중...' : '가입하기'}
            </motion.button>
          </form>

          <p className="text-center text-[13px] mt-8" style={{ color: 'rgba(23,24,45,0.45)' }}>
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: '#17182D' }}>
              로그인
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
