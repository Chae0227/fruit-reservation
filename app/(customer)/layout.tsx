import Link from 'next/link'
import { getSession } from '@/lib/session'
import { User } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight text-neutral-900">
            과일가게
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[15px] text-neutral-500 font-medium">
            <Link href="/products" className="hover:text-neutral-900 transition-colors">상품</Link>
          </nav>
          <div className="flex items-center gap-3 text-[14px]">
            {session ? (
              <>
                <Link
                  href="/mypage"
                  className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <User size={15} />
                  <span className="hidden sm:inline">{session.name}님</span>
                </Link>
                <LogoutButton name={session.name} />
              </>
            ) : (
              <>
                <Link href="/login" className="text-neutral-500 hover:text-neutral-800 transition-colors">
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="bg-neutral-900 text-white px-4 py-2 rounded-full text-[13px] font-semibold hover:bg-neutral-700 transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-neutral-50 border-t border-neutral-100 mt-20">
        <div className="max-w-6xl mx-auto px-5 py-12">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <p className="font-bold text-neutral-900 text-base mb-2">과일가게</p>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
                제철 과일을 직접 선별해 가장 신선한 상태로 제공합니다.<br />
                픽업 예약으로 대기 없이 편하게 받아가세요.
              </p>
            </div>
            <div className="flex gap-16 text-sm">
              <div>
                <p className="font-semibold text-neutral-700 mb-3">서비스</p>
                <ul className="space-y-2 text-neutral-400">
                  <li><Link href="/products" className="hover:text-neutral-700 transition-colors">상품 예약</Link></li>
                  <li><Link href="/mypage" className="hover:text-neutral-700 transition-colors">내 예약</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-neutral-700 mb-3">계정</p>
                <ul className="space-y-2 text-neutral-400">
                  <li><Link href="/login" className="hover:text-neutral-700 transition-colors">로그인</Link></li>
                  <li><Link href="/register" className="hover:text-neutral-700 transition-colors">회원가입</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-200 mt-10 pt-6 text-xs text-neutral-400">
            © 2025 과일가게. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
