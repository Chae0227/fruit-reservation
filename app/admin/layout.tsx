import Link from 'next/link'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { LayoutDashboard, Package, ClipboardList, Store } from 'lucide-react'
import NavLink from './NavLink'
import AdminLogoutButton from './AdminLogoutButton'

const navItems = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/products', label: '상품 관리', icon: Package },
  { href: '/admin/reservations', label: '예약 관리', icon: ClipboardList },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') redirect('/login')

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-4 py-5 border-b border-gray-100 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center">
            <Store size={14} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm leading-none">과일가게</p>
            <p className="text-xs text-gray-400 mt-0.5">관리자</p>
          </div>
        </div>

        <nav className="flex-1 py-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} Icon={item.icon} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-700 mb-0.5">{session.name}</p>
          <AdminLogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
