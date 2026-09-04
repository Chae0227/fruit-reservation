import Link from 'next/link'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import AdminLogoutButton from './AdminLogoutButton'

const navItems = [
  { href: '/admin', label: '대시보드', icon: '📊' },
  { href: '/admin/products', label: '상품 관리', icon: '🍎' },
  { href: '/admin/reservations', label: '예약 관리', icon: '📋' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') redirect('/login')

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <p className="font-bold text-gray-800 text-sm">🍊 과일가게</p>
          <p className="text-xs text-gray-400 mt-0.5">관리자 워크스페이스</p>
        </div>
        <nav className="flex-1 py-4">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">운영</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">{session.name}님</p>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
