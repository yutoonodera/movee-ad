import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import * as Constants from './constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: Constants.TITLE,
  description: Constants.DESCRIPTION,
  openGraph: {
    title: Constants.TITLE,
    description: Constants.DESCRIPTION,
    images: [
      {
        url: `${process.env.PUBLIC_BASE_URL}${Constants.OPEN_GRAPH_IMAGE}`, // public 内のOGP画像
        width: Constants.OPEN_GRAPH_IMAGE_WIDTH,
        height: Constants.OPEN_GRAPH_IMAGE_HEIGHT,
        alt: Constants.TITLE,
      },
    ],
  },
  twitter: { // X（Twitter）向けのOGP設定
    card: "summary", // 画像付きカード
    title: Constants.TITLE,
    description: Constants.DESCRIPTION,
    images: [`${process.env.PUBLIC_BASE_URL}${Constants.OPEN_GRAPH_IMAGE}`], // Twitterは配列ではなく単一URLを期待するが、Next.jsのMetadata型では配列を受け付ける
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja"> {/* 日本語ページなら "ja" */}
      <link rel="icon" href="/favicon.ico" />
      <body className={inter.className}>{children}</body>
    </html>
  )
}
