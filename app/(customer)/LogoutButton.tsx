'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton({ name }: { name: string }) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-stone-500">{name}님</span>
      <button
        onClick={handleLogout}
        className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
      >
        로그아웃
      </button>
    </div>
  )
}
