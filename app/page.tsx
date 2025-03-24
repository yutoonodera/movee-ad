"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // useSearchParamsをインポート
import CardList from "./components/CardList";
import "./globals.css";
import * as Constants from './constants'

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
        // 日本時間での相対時間を計算する関数
        const formatLastEditedTime = (utcTime: string): string => {
          const lastEditTime = new Date(utcTime);
          const lastEditJST = new Date(lastEditTime.getTime() + 9 * 60 * 60 * 1000);
          const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000);

          const timeDifference = nowJST.getTime() - lastEditJST.getTime();
          const hoursDifference = timeDifference / (1000 * 60 * 60);

          if (hoursDifference < 24) return "本日";
          if (hoursDifference < 48) return "1日前";
          if (hoursDifference < 72) return "2日前";
          if (hoursDifference < 96) return "3日前";
          if (hoursDifference < 120) return "4日前";
          if (hoursDifference < 144) return "5日前";
          if (hoursDifference < 168) return "6日前";
          if (hoursDifference < 192) return "1週間前";
          if (hoursDifference < 312) return "2週間前";
          if (hoursDifference < 480) return "3週間前";
          if (hoursDifference < 696) return "1ヶ月前";
          if (hoursDifference < 1416) return "2ヶ月前";
          if (hoursDifference < 2136) return "3ヶ月前";
          if (hoursDifference < 2856) return "4ヶ月前";
          if (hoursDifference < 3576) return "5ヶ月前";
          if (hoursDifference < 4296) return "6ヶ月前";
          return "1年以上前";
        };

        const extractedData = data.results.map((item: any) => ({
          title: item.properties.Name.title[0]?.text?.content || Constants.TITLE,
          updateUser: item.properties.updatedUser?.last_edited_by?.name || Constants.MOVEE_USER,
          lastEditBy: formatLastEditedTime(item.last_edited_time), // JSTで処理済みのテキスト
          icon: item.properties.icon?.files[0]?.file?.url || "", // アイコンURLを絶対URLに変換
          link: `/details/${item.id}`,
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
      {/* カードリストコンポーネント */}
      <CardList notionData={notionData.map(item => ({ ...item, isActive: false }))} onCardClick={handleCardClick} />
    </main>
  );
}
