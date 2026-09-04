import { NextRequest, NextResponse } from 'next/server'
import { parseSessionToken } from '@/lib/session'

const COOKIE_NAME = 'fr_session'

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  const user = token ? parseSessionToken(token) : null
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    if (!user || user.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname === '/mypage') {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if ((pathname === '/login' || pathname === '/register') && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/mypage', '/login', '/register'],
}
