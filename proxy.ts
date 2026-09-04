import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'fr_session'

function base64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
  return atob(padded)
}

async function verifyToken(token: string): Promise<{ role: string } | null> {
  const dot = token.lastIndexOf('.')
  if (dot === -1) return null
  const data = token.slice(0, dot)
  const sigHex = token.slice(dot + 1)

  const secret = process.env.SESSION_SECRET
  if (!secret) return null

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const sigBytes = new Uint8Array(sigHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)))
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(data))
  if (!valid) return null

  try {
    return JSON.parse(base64urlDecode(data))
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  const user = token ? await verifyToken(token) : null
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
