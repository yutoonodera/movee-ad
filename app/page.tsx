"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // useRouterをインポート
import { Typography, Card, Modal, Button } from "antd";
import { CoffeeOutlined, HomeOutlined } from "@ant-design/icons";
import './globals.css';

const { Paragraph } = Typography;

export default function Home() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "", link: "" });
  const [loaded, setLoaded] = useState(false);
  const [activeButton, setActiveButton] = useState("all");
  const [notionData, setNotionData] = useState<{ title: string; link: string }[]>([]);

  const router = useRouter(); // useRouterフックを使う

  useEffect(() => {
    setLoaded(true);

    // APIルート経由でNotionデータを取得
    const fetchNotionData = async () => {
      try {
        const response = await fetch("/api/notion", { method: "POST" });
        if (!response.ok) throw new Error("Failed to fetch Notion data");

        const data = await response.json();
        console.log("Fetched Notion Data:", data);

        // Notion APIのレスポンスからタイトルを取得
        const extractedData = data.results.map((item: any) => ({
          title: item.properties.Name.title[0]?.text?.content || "無題",
          link: `/details/${item.id}`, // 仮のリンク設定
        }));

        setNotionData(extractedData);
      } catch (error) {
        console.error("Notion APIの取得エラー:", error);
      }
    };

    fetchNotionData();
  }, []);

  const openModal = (title: string, text: string, link: string) => {
    setModalContent({ title, text, link });
    setIsModalVisible(true);
  };

  const handleNavigate = () => {
    setIsModalVisible(false); // モーダルを閉じる
    router.push(modalContent.link); // Next.js の内部リンクに遷移
  };

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}>
      <div className="flex justify-center w-full mb-6 space-x-4">
        <Button type={activeButton === "all" ? "primary" : "default"} onClick={() => handleButtonClick("all")}>
          オール
        </Button>
        <Button type={activeButton === "tech" ? "primary" : "default"} onClick={() => handleButtonClick("tech")}>
          テック
        </Button>
        <Button type={activeButton === "finance" ? "primary" : "default"} onClick={() => handleButtonClick("finance")}>
          会計
        </Button>
      </div>

      {/* カードリスト */}
      <div className="grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-3 lg:text-left gap-4">
        {notionData.map((item, index) => (
          <Card
            key={index}
            title={<span className="block text-sm whitespace-normal overflow-hidden text-ellipsis">{item.title}</span>}
            hoverable
            className="border border-gray-300 dark:border-neutral-700 flex flex-col items-center"
            onClick={() => openModal(item.title, "ここにはNotionのテキストが入る。", item.link)}
            style={{ width: "100%" }}
          >
            <div className="flex justify-center items-center h-10">
              <CoffeeOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
            </div>
            <div className="flex justify-center items-center">onody</div>
            <div className="flex justify-center items-center">3時間前</div>
          </Card>
        ))}
      </div>

      {/* モーダル */}
      <Modal
        title={modalContent.title}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>閉じる</Button>,
          <Button key="link" type="primary" onClick={handleNavigate}>詳細を見る</Button>,
        ]}
      >
        <Paragraph>{modalContent.text}</Paragraph>
      </Modal>
    </main>
  );
}
