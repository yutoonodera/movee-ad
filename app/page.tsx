"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CardList from "./components/CardList";
import { formatDaytoDayAgo } from "./utils/timeFormatter";
import "./globals.css";
import * as Constants from './constants'
import { CATCH_COPY } from "./constants";

export default function DetailsPage() {
  const [loaded, setLoaded] = useState(false);
  const [notionData, setNotionData] = useState<{ title: string; updateUser: string; lastEditBy: string; icon: string; link: string }[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoaded(true);

    const fetchNotionData = async () => {
      try {
        const response = await fetch("/api/notion", { method: "POST" });
        if (!response.ok) throw new Error("Failed to fetch Notion data");

        const data = await response.json();
        const extractedData = data.results.map((item: any) => ({
          title: item.properties.Name.title[0]?.text?.content || Constants.TITLE,
          updateUser: item.properties.updatedUser?.last_edited_by?.name || Constants.MOVEE_USER,
          lastEditBy: formatDaytoDayAgo(item.last_edited_time),
          icon: item.properties.icon?.files[0]?.file?.url || "",
          link: `/blog/${item.id}`,
        }));
        setNotionData(extractedData);
      } catch (error) {
        console.error("Notion APIの取得エラー:", error);
      }
    };

    fetchNotionData();
  }, []);

  const handleCardClick = (link: string) => {
    router.push(link);
  };

  return (
    <main className="flex flex-col justify-between min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">{CATCH_COPY}</h1>

      <section className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">オープンソース開発</h2>
        <p>許可なく利用可能なプログラム提供</p>
        <div className="mb-4"></div>
        <div className="space-y-2">
          <div>
            <strong>
              <a href="https://github.com/yutoonodera/movee-ad" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition">
                ちょっとブログ
              </a>
            </strong> - React,Next.js,TypeScript
          </div>
          <div>
            <strong>
              <a href="https://github.com/yutoonodera/setsumeikaikei" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition">
                説明する会計
              </a>
            </strong> - React,Java21,Spring Boot,PostgreSQL
          </div>
          <div>
            <strong>
              <a href="https://github.com/yutoonodera/mReactionData" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition">
                mReactionData
              </a>
            </strong> - Express.js,TypeScript,Redis
          </div>
        </div>
      </section>

      <section className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">受託開発・SES</h2>
        <p>ソフトウェア開発の受託およびSESによるエンジニア提供</p>
      </section>

      <CardList notionData={notionData.map(item => ({ ...item, isActive: false }))} onCardClick={handleCardClick} />
      <div className="mb-8"></div>
      {/* Company Information Section */}
      <section className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">会社情報</h2>
        <div className="space-y-4">
          <div>
            <strong>会社名:</strong> movee株式会社
          </div>
          <div>
            <strong>代表者:</strong> 小野寺 祐人
          </div>
          <div>
            <strong>住所:</strong> 福岡県福岡市中央区天神２丁目３−１０ 天神パインクレスト 716（バーチャルオフィス）
          </div>
          <div>
            <strong>資本金:</strong> 150万円
          </div>
          <div>
            <strong>問い合わせ先:</strong> info[at]movee.jp （[at]を@に変えてください）
          </div>
        </div>
      </section>
    </main>
  );
}
