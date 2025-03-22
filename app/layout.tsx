import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'moveeブログ',
  description: '株式会社moveeの公式ブログです。ソフトウェア開発に関する情報を発信しています。',
  openGraph: {
    title: 'moveeブログ',
    description: '株式会社moveeの公式ブログです。ソフトウェア開発に関する情報を発信しています。',
    images: [
      {
        url: '/images/default.png', // public 内のOGP画像
        width: 1200,
        height: 630,
        alt: 'moveeブログ',
      },
    ],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja"> {/* 日本語ページなら "ja" */}
      <body className={inter.className}>{children}</body>
    </html>
  )
}
