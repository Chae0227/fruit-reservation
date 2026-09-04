import Link from 'next/link'
import { getSession } from '@/lib/session'
import { User } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F8F5' }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: 'rgba(248,248,245,0.92)', backdropFilter: 'blur(12px)', borderColor: 'rgba(23,24,45,0.08)' }}
      >
        <div className="max-w-6xl mx-auto px-10 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-[17px]" style={{ color: '#17182D', letterSpacing: '-0.01em' }}>
            과일가게
          </Link>
          <nav className="flex items-center gap-6" style={{ fontSize: 14, color: 'rgba(23,24,45,0.55)', fontWeight: 500 }}>
            <Link href="/products" className="hover:text-[#17182D] transition-colors">상품</Link>
            {session ? (
              <>
                <Link href="/mypage" className="flex items-center gap-1.5 hover:text-[#17182D] transition-colors">
                  <User size={14} /> {session.name}님
                </Link>
                <LogoutButton name={session.name} />
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-[#17182D] transition-colors">로그인</Link>
                <Link
                  href="/register"
                  className="font-semibold text-white px-4 py-1.5 transition-opacity hover:opacity-80"
                  style={{ background: '#17182D', borderRadius: 10, fontSize: 13 }}
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer style={{ background: '#FFFFFF', borderTop: '1px solid rgba(23,24,45,0.07)' }} className="mt-24">
        <div className="max-w-6xl mx-auto px-10 py-14 flex flex-col md:flex-row justify-between gap-10">
          <div>
            <p className="font-bold text-[15px] mb-2" style={{ color: '#17182D' }}>과일가게</p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(23,24,45,0.45)', maxWidth: 260 }}>
              제철 과일을 직접 선별해 가장 신선한 상태로 제공합니다.
              픽업 예약으로 대기 없이 편하게 받아가세요.
            </p>
          </div>
          <div className="flex gap-14 text-sm">
            {[
              { title: '서비스', links: [{ label: '상품 예약', href: '/products' }, { label: '내 예약', href: '/mypage' }] },
              { title: '계정',   links: [{ label: '로그인',  href: '/login'    }, { label: '회원가입', href: '/register' }] },
            ].map((g) => (
              <div key={g.title}>
                <p className="font-semibold mb-3" style={{ color: '#17182D' }}>{g.title}</p>
                <ul className="space-y-2">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="transition-colors hover:text-[#17182D]" style={{ color: 'rgba(23,24,45,0.45)' }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-10 pb-8 text-xs" style={{ color: 'rgba(23,24,45,0.3)' }}>
          © 2025 과일가게. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
