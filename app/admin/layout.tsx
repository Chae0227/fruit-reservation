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
    <div className="min-h-screen flex" style={{ background: '#F8F8F5' }}>
      <aside className="w-56 shrink-0 flex flex-col" style={{ background: '#FFFFFF', borderRight: '1px solid rgba(23,24,45,0.07)' }}>
        <div className="px-4 py-5 flex items-center gap-2.5" style={{ borderBottom: '1px solid rgba(23,24,45,0.06)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#FFF0E5' }}>
            <Store size={14} style={{ color: '#F97316' }} />
          </div>
          <div>
            <p className="font-bold text-sm leading-none" style={{ color: '#17182D' }}>오색청과</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(23,24,45,0.4)' }}>관리자</p>
          </div>
        </div>

        <nav className="flex-1 py-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} Icon={item.icon} />
          ))}
        </nav>

        <div className="p-4" style={{ borderTop: '1px solid rgba(23,24,45,0.06)' }}>
          <p className="text-xs font-medium mb-0.5" style={{ color: '#17182D' }}>{session.name}</p>
          <AdminLogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
