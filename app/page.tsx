"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // useSearchParamsをインポート
import ModalComponent from "./components/ModalComponent";
import CardList from "./components/CardList";
import "./globals.css";

export default function DetailsPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "", link: "" });
  const [loaded, setLoaded] = useState(false);
  const [notionData, setNotionData] = useState<{ title: string; updateUser: string; lastEditBy: String; link: string }[]>([]);

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
          title: item.properties.Name.title[0]?.text?.content || "無題",
          updateUser: item.properties.updatedUser?.last_edited_by?.name || "不明なユーザー",
          lastEditBy: formatLastEditedTime(item.last_edited_time), // JSTで処理済みのテキスト
          link: `/details/${item.id}`,
        }));

        setNotionData(extractedData);
      } catch (error) {
        console.error("Notion APIの取得エラー:", error);
      }
    };

    fetchNotionData();
  });

  const openModal = (title: string, text: string, link: string) => {
    setModalContent({ title, text, link });
    setIsModalVisible(true);
  };

  const handleNavigate = () => {
    setIsModalVisible(false);
    router.push(modalContent.link);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      {/* カードリストコンポーネント */}
      <CardList notionData={notionData.map(item => ({ ...item, isActive: false }))} openModal={openModal} />

      {/* モーダルコンポーネント */}
      <ModalComponent
        title={modalContent.title}
        text={modalContent.text}
        link={modalContent.link}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleNavigate={handleNavigate}
      />
    </main>
  );
}
