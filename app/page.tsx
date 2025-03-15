"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // useSearchParamsをインポート
import SelectionButtons from "./components/SelectionButtons";
import ModalComponent from "./components/ModalComponent";
import CardList from "./components/CardList";
import "./globals.css";

export default function DetailsPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "", link: "" });
  const [loaded, setLoaded] = useState(false);
  const [activeButton, setActiveButton] = useState("all");
  const [notionData, setNotionData] = useState<{ title: string; link: string }[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams(); // searchParamsフックを使用

  useEffect(() => {
    // クエリパラメータからactiveButtonを取得
    const buttonParam = searchParams.get("button");
    if (buttonParam) {
      setActiveButton(buttonParam); // URLパラメータに基づいてボタンの状態をセット
    }

    setLoaded(true);

    const fetchNotionData = async () => {
      try {
        const response = await fetch("/api/notion", { method: "POST" });
        if (!response.ok) throw new Error("Failed to fetch Notion data");

        const data = await response.json();
        const extractedData = data.results.map((item: any) => ({
          title: item.properties.Name.title[0]?.text?.content || "無題",
          link: `/details/${item.id}?button=${activeButton}`, // 詳細ページのURLにボタンの状態を渡す
        }));

        setNotionData(extractedData);
      } catch (error) {
        console.error("Notion APIの取得エラー:", error);
      }
    };

    fetchNotionData();
  }, [searchParams, activeButton]); // activeButtonの変更を監視

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
      {/* 選択ボタンコンポーネント */}
      <SelectionButtons activeButton={activeButton} handleButtonClick={setActiveButton} />

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
        activeButton={activeButton} // activeButtonを渡す
      />
    </main>
  );
}
