import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import * as Constants from "../constants";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

// blog 配下だけ metadata を上書き
export const metadata: Metadata = {
  title: Constants.BLOG_TITLE,
  description: Constants.BLOG_DESCRIPTION,
  openGraph: {
    title: Constants.BLOG_TITLE,
    description: Constants.BLOG_DESCRIPTION,
    images: [
      {
        url: `${process.env.PUBLIC_BASE_URL}${Constants.OPEN_GRAPH_IMAGE}`, // public 内のOGP画像
        width: Constants.OPEN_GRAPH_IMAGE_WIDTH,
        height: Constants.OPEN_GRAPH_IMAGE_HEIGHT,
        alt: Constants.BLOG_TITLE,
      },
    ],
  },
  twitter: { // X（Twitter）向けのOGP設定
    card: "summary", // 画像付きカード
    title: Constants.BLOG_TITLE,
    description: Constants.BLOG_DESCRIPTION,
    images: [`${process.env.PUBLIC_BASE_URL}${Constants.OPEN_GRAPH_IMAGE}`], // Twitterは配列ではなく単一URLを期待するが、Next.jsのMetadata型では配列を受け付ける
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
