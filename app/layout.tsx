import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: '과일가게', template: '%s | 과일가게' },
  description: '신선한 제철 과일을 미리 예약하고 편하게 픽업하세요.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
