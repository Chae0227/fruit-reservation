import { createHmac } from 'crypto'
import { cookies } from 'next/headers'
import type { SessionUser } from './types'

const SECRET = process.env.SESSION_SECRET!
const COOKIE_NAME = 'fr_session'

function sign(data: string): string {
  return createHmac('sha256', SECRET).update(data).digest('hex')
}

export function createSessionToken(payload: SessionUser): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${data}.${sign(data)}`
}

export function parseSessionToken(token: string): SessionUser | null {
  const dot = token.lastIndexOf('.')
  if (dot === -1) return null
  const data = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  if (sign(data) !== sig) return null
  try {
    return JSON.parse(Buffer.from(data, 'base64url').toString()) as SessionUser
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return parseSessionToken(token)
}

export async function setSessionCookie(user: SessionUser): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, createSessionToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
