import Link from 'next/link'
import { getSession } from '@/lib/session'
import { ShoppingBag, User } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#faf8f4' }}>
      <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-stone-900 tracking-tight text-base">
            과일가게
          </Link>
          <nav className="flex items-center gap-6 text-sm text-stone-500">
            <Link href="/products" className="hover:text-stone-900 transition-colors">상품</Link>
            {session ? (
              <>
                <Link href="/mypage" className="hover:text-stone-900 transition-colors flex items-center gap-1.5">
                  <User size={14} />
                  내 예약
                </Link>
                <LogoutButton name={session.name} />
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-stone-900 transition-colors">로그인</Link>
                <Link
                  href="/register"
                  className="bg-stone-900 text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-stone-700 transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-stone-100 py-8 text-center text-xs text-stone-400">
        © 2025 과일가게. All rights reserved.
      </footer>
    </div>
  )
}
