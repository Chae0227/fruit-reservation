import Link from 'next/link'
import { getSession } from '@/lib/session'
import LogoutButton from './LogoutButton'

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#faf8f4' }}>
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight text-stone-800">
            🍊 과일가게
          </Link>
          <nav className="flex items-center gap-4 text-sm text-stone-600">
            <Link href="/products" className="hover:text-stone-900 transition-colors">상품</Link>
            {session ? (
              <>
                <Link href="/mypage" className="hover:text-stone-900 transition-colors">내 예약</Link>
                <LogoutButton name={session.name} />
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-stone-900 transition-colors">로그인</Link>
                <Link
                  href="/register"
                  className="bg-stone-800 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-stone-700 transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-stone-200 py-8 text-center text-xs text-stone-400">
        © 2025 과일가게. 신선함을 예약하세요.
      </footer>
    </div>
  )
}
