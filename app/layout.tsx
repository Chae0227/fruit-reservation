import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '과일 예약',
  description: '신선한 과일 픽업 예약 서비스',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
