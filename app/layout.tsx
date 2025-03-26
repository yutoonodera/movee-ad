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
        url: Constants.OPEN_GRAPH_IMAGE, // public 内のOGP画像
        width: Constants.OPEN_GRAPH_IMAGE_WIDTH,
        height: Constants.OPEN_GRAPH_IMAGE_HEIGHT,
        alt: Constants.TITLE,
      },
    ],
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
