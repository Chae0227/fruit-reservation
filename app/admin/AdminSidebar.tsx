'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ClipboardList, Store, Tag, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: '대시보드', Icon: LayoutDashboard },
  { href: '/admin/categories', label: '카테고리', Icon: Tag },
  { href: '/admin/products', label: '상품 관리', Icon: Package },
  { href: '/admin/reservations', label: '예약 관리', Icon: ClipboardList },
]

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
  window.location.href = '/login'
}

export default function AdminSidebar({ name }: { name: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 flex flex-col" style={{ background: '#FFFFFF', borderRight: '1px solid rgba(23,24,45,0.07)' }}>
      <div className="px-4 py-5 flex items-center gap-2.5" style={{ borderBottom: '1px solid rgba(23,24,45,0.06)' }}>
        <img src="/logo.png" alt="오색청과" style={{ height: 30, width: 30, objectFit: 'contain' }} />
        <div>
          <p className="font-bold text-sm leading-none" style={{ color: '#17182D' }}>오색청과</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(23,24,45,0.4)' }}>관리자</p>
        </div>
      </div>

      <nav className="flex-1 py-3 space-y-0.5">
        {navItems.map(({ href, label, Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg mx-2 transition-all"
              style={active
                ? { background: '#FFF0E5', color: '#F5A623', fontWeight: 600 }
                : { color: 'rgba(23,24,45,0.5)' }
              }
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4" style={{ borderTop: '1px solid rgba(23,24,45,0.06)' }}>
        <p className="text-[12px] font-medium mb-2" style={{ color: '#17182D' }}>{name}</p>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-[12px] transition-opacity hover:opacity-60"
          style={{ color: 'rgba(23,24,45,0.4)' }}
        >
          <LogOut size={12} /> 로그아웃
        </button>
      </div>
    </aside>
  )
}
