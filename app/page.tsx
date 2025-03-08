"use client";

import { useEffect, useState } from "react";
import { Typography, Card, Modal, Button } from "antd";

const { Title, Paragraph } = Typography;

export default function Home() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "", link: "" });
  const [loaded, setLoaded] = useState(false);

  // ページがロードされたときにopacityを100に設定
  useEffect(() => {
    setLoaded(true);
  }, []);

  // カードをクリックするとモーダルを開く
  const openModal = (title: string, text: string, link: string) => {
    setModalContent({ title, text, link });
    setIsModalVisible(true);
  };

  // モーダルのボタンで遷移
  const handleNavigate = () => {
    window.location.href = modalContent.link;
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-4">

        {/* カード1 */}
        <Card
          title={
            <span style={{ fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              倒産危機の予兆！ソニーの２０２４年度決算の分析
            </span>
          }
          hoverable
          className="border border-gray-300 dark:border-neutral-700"
          onClick={() => openModal(
            " 倒産危機の予兆！ソニーの２０２４年度決算の分析",
            "ソニーの2024年度決算の詳細な分析。売上・利益・市場動向について詳しく解説。ソニーの2024年度決算の詳細な分析。売上・利益・市場動向について詳しく解説。ソニーの2024年度決算の詳細な分析。売上・利益・市場動向について詳しく解説。",
            "https://nextjs.org/docs"
          )}
          style={{ width: "100%" }}
        >
          <Paragraph ellipsis={{ rows: 2 }}>
            ソニーの2024年度決算の詳細な分析。売上・利益・市場動向について詳しく解説。
          </Paragraph>
        </Card>

        {/* カード2 */}
        <Card
          title={
            <span style={{ fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Docs
            </span>
          }
          hoverable
          className="border border-gray-300 dark:border-neutral-700"
          onClick={() => openModal(
            "Docs",
            "Find in-depth information about Next.js features and API.",
            "https://nextjs.org/docs"
          )}
          style={{ width: "100%" }}
        >
          <Paragraph ellipsis={{ rows: 2 }}>
            Find in-depth information about Next.js features and API.
          </Paragraph>
        </Card>

        {/* カード3 */}
        <Card
          title={
            <span style={{ fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Another Example
            </span>
          }
          hoverable
          className="border border-gray-300 dark:border-neutral-700"
          onClick={() => openModal(
            "Another Example",
            "Another detailed example about some subject.",
            "https://nextjs.org/docs"
          )}
          style={{ width: "100%" }}
        >
          <Paragraph ellipsis={{ rows: 2 }}>
            Another detailed example about some subject.
          </Paragraph>
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
