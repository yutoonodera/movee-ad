"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // useRouterをインポート
import { Typography, Card, Modal, Button } from "antd";
import { CoffeeOutlined, HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import './globals.css';

const { Paragraph } = Typography;

export default function Home() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "", link: "" });
  const [loaded, setLoaded] = useState(false);
  const [activeButton, setActiveButton] = useState("all");

  const router = useRouter(); // useRouterフックを使う

  useEffect(() => {
    setLoaded(true);
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
        {/* カード1 (直接リンク) */}
        <Card
          title={<span className="block text-sm whitespace-normal overflow-hidden text-ellipsis">倒産危機なのかもしれないソニーの２０２４年度決算の分析</span>}
          hoverable
          className="border border-gray-300 dark:border-neutral-700 flex flex-col items-center"
          onClick={() => openModal(
            "倒産危機なのかもしれないソニーの２０２４年度決算の分析",
            "ソニーの2024年度決算の詳細な分析。売上・利益・市場動向について詳しく解説。",
            "/details/sony2024" // 内部リンクをセット
          )}
          style={{ width: "100%" }}
        >
          <div className="flex justify-center items-center h-10">
            <CoffeeOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </div>
          <div className="flex justify-center items-center">onody</div>
          <div className="flex justify-center items-center">3時間前</div>
        </Card>

        {/* カード2 (モーダル表示) */}
        <Card
          title={<span className="block text-sm whitespace-normal overflow-hidden text-ellipsis">倒産危機なのかもしれないソニーの２０２４年度決算の分析</span>}
          hoverable
          className="border border-gray-300 dark:border-neutral-700 flex flex-col items-center"
          onClick={() => openModal(
            "倒産危機なのかもしれないソニーの２０２４年度決算の分析",
            "ソニーの2024年度決算の詳細な分析。売上・利益・市場動向について詳しく解説。",
            "/details/sony2024" // 内部リンクをセット
          )}
          style={{ width: "100%" }}
        >
          <div className="flex justify-center items-center h-10">
            <CoffeeOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </div>
          <div className="flex justify-center items-center">onody</div>
          <div className="flex justify-center items-center">3時間前</div>
        </Card>
      </div>

      {/* モーダル */}
      <Modal
        title={modalContent.title}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>閉じる</Button>,
          <Button key="link" type="primary" onClick={handleNavigate}>詳細を見る</Button>
        ]}
      >
        <Paragraph>{modalContent.text}</Paragraph>
      </Modal>
    </main>
  );
}
