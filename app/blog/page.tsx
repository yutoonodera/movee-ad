"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // useSearchParamsをインポート
import CardList from "../components/CardList";
import { formatDaytoDayAgo } from "../utils/timeFormatter";
import "../globals.css";
import * as Constants from '../constants'
import { TITLE } from "../constants";

export default function DetailsPage() {
  const [loaded, setLoaded] = useState(false);
  const [notionData, setNotionData] = useState<{ title: string; updateUser: string; lastEditBy: string; icon:string; link: string }[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams(); // searchParamsフックを使用

  useEffect(() => {
    setLoaded(true);

    const fetchNotionData = async () => {
      try {
        const response = await fetch("/api/notion", { method: "POST" });
        if (!response.ok) throw new Error("Failed to fetch Notion data");

        const data = await response.json();
        console.log("aaa");
        console.log(data.results);
        const extractedData = data.results.map((item: any) => ({
          title: item.properties.Name.title[0]?.text?.content || Constants.TITLE,
          updateUser: item.properties.updatedUser?.last_edited_by?.name || Constants.MOVEE_USER,
          lastEditBy: formatDaytoDayAgo(item.last_edited_time), // JSTで処理済みのテキスト
          icon: item.properties.icon?.files[0]?.file?.url || "", // アイコンURLを絶対URLに変換
          link: `/blog/${item.id}`,
        }));
        console.log("extractedData");
        console.log(extractedData);
        setNotionData(extractedData);
      } catch (error) {
        console.error("Notion APIの取得エラー:", error);
      }
    };

    fetchNotionData();
  }, []); // 空の配列を指定して再レンダリング時の実行を防ぐ

  const handleCardClick = (link: string) => {
    router.push(link);
  };

  return (
    <main className="flex flex-col justify-between min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">{TITLE}</h1>
      {/* カードリストコンポーネント */}
      <CardList notionData={notionData.map(item => ({ ...item, isActive: false }))} onCardClick={handleCardClick} />
    </main>
  );
}
