"use client";

import useSWR from "swr"; // SWRライブラリをインポート
import { useRouter, useParams } from "next/navigation";
import { Typography, Spin, Alert } from "antd";
import CardList from "../../components/CardList";
import ModalComponent from "../../components/ModalComponent";
import "../.././globals.css";
import { useEffect, useState } from "react";

const { Title, Paragraph } = Typography;

// APIフェッチ用の関数を定義
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CombinedPage() {
  const { id } = useParams(); // 現在表示している記事のIDを取得
  const router = useRouter();

  // SWRを使ってデータをフェッチ＆キャッシュ
  const { data: notionDetails, error, isLoading } = useSWR(
    id ? `/api/notionDetails?id=${id}` : null,
    fetcher
  );

  const [homeNotionData, setHomeNotionData] = useState<{ title: string; link: string }[]>([]);
  const [modalContent, setModalContent] = useState({ title: "", text: "", link: "" });
  const [isModalVisible, setIsModalVisible] = useState(false);

  // カードリストデータを取得
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch("/api/notion", { method: "POST" });
        if (!response.ok) throw new Error("Failed to fetch Notion data");

        const data = await response.json();
        const extractedData = data.results.map((item: any) => ({
          title: item.properties.Name?.title[0]?.text?.content || "無題",
          link: `/details/${item.id}`,
        }));

        setHomeNotionData(extractedData);
      } catch (error) {
        console.error("Notion APIの取得エラー:", error);
      }
    };

    fetchHomeData();
  }, []);

  const openModal = (title: string, text: string, link: string) => {
    setModalContent({ title, text, link });
    setIsModalVisible(true);
  };

  const handleNavigate = () => {
    setIsModalVisible(false);
    router.push(modalContent.link);
  };

  if (isLoading) return <Spin size="large" />;
  if (error) return <Alert message="データの取得に失敗しました" type="error" showIcon />;

  return (
    <main className="flex flex-col justify-between min-h-screen p-6 max-w-3xl mx-auto">
      {/* タイトルの表示 */}
      <section className="mb-8">
        <Title level={1}>
          {notionDetails?.page?.properties?.Name?.title[0]?.text?.content || "タイトルなし"}
        </Title>
      </section>

      {/* ブロック情報を表示 */}
      <section>
        {notionDetails?.blocks?.results?.map((block: any) => (
          <div key={block.id}>
            {block.heading_1?.rich_text?.map((text: any) => (
              <Title level={2} key={text.text?.content}>
                {text.text?.content || "データなし"}
              </Title>
            ))}
            {block.paragraph?.rich_text?.map((text: any) => (
              <Paragraph key={text.text?.content}>
                {text.text?.content || "データなし"}
              </Paragraph>
            ))}
            {/* 画像ブロック */}
            {block.type === "image" && (
              <div style={{ marginBottom: "20px" }}>
                <img
                  src={block.image.file?.url}
                  alt={block.image.caption?.[0]?.plain_text || "画像"}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* カードリスト */}
      <section className="flex flex-col mt-auto">
        <CardList
          notionData={homeNotionData.map((item: any) => ({
            ...item,
            isActive: item.link === `/details/${id}`,
          }))}
          openModal={openModal}
        />
      </section>

      {/* モーダル */}
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
