'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'

type Props = { href: string; Icon: LucideIcon; label: string }

export default function NavLink({ href, Icon, label }: Props) {
  const pathname = usePathname()
  const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg mx-2 transition-all"
      style={
        active
          ? { background: '#FFF0E5', color: '#F5A623', fontWeight: 600 }
          : { color: 'rgba(23,24,45,0.5)' }
      }
    >
      <Icon size={15} />
      {label}
    </Link>
  )
}
