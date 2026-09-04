'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton({ name }: { name: string }) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1 text-[13px] font-medium transition-opacity hover:opacity-60"
      style={{ color: 'rgba(23,24,45,0.45)' }}
    >
      <LogOut size={13} />
      로그아웃
    </button>
  )
}
