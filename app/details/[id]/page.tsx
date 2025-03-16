"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Typography, Spin, Alert } from "antd";
import SelectionButtons from "../../components/SelectionButtons";
import CardList from "../../components/CardList";
import ModalComponent from "../../components/ModalComponent";
import "../.././globals.css";

const { Title, Paragraph } = Typography;

export default function CombinedPage() {
  const { id } = useParams(); // 現在表示している記事のIDを取得
  const router = useRouter();

  const [detailsLoading, setDetailsLoading] = useState(true);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [notionDetails, setNotionDetails] = useState<any>(null);
  const [homeNotionData, setHomeNotionData] = useState<{ title: string; link: string }[]>([]);
  const [modalContent, setModalContent] = useState({ title: "", text: "", link: "" });
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 詳細データを取得
  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/notionDetails?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch Notion details");

        const data = await response.json();
        setNotionDetails(data);
      } catch (err) {
        setDetailsError("データの取得に失敗しました");
        console.error("Error fetching details:", err);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // カードリストデータを取得
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch("/api/notion", { method: "POST" });
        if (!response.ok) throw new Error("Failed to fetch Notion data");

        const data = await response.json();
        const extractedData = data.results.map((item: any) => ({
          title: item.properties.Name.title[0]?.text?.content || "無題",
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
  if (detailsLoading) return <Spin size="large" />;
  if (detailsError) return <Alert message={detailsError} type="error" showIcon />;

  return (
    <main className="flex flex-col justify-between min-h-screen p-6 max-w-3xl mx-auto">
      {/* DetailsPage の内容 */}
      <section className="mb-8">
        <Title level={2}>Notion詳細ページ</Title>
        {notionDetails?.results?.map((block: any) => (
          <div key={block.id}>
            {/* Heading 1 ブロック */}
            {block.heading_1?.rich_text?.map((text: any) => (
              <Title level={1} key={text.text.content}>
                {text.text.content || "データなし"}
              </Title>
            ))}

            {/* Paragraph ブロック */}
            {block.paragraph?.rich_text?.map((text: any) => (
              <Paragraph key={text.text.content}>
                {text.text.content || "データなし"}
              </Paragraph>
            ))}

            {/* 画像を表示 */}
            {block.image?.file?.url && (
              <img
                src={block.image.file.url}
                alt="Notion Image"
                style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
              />
            )}
          </div>
        ))}
      </section>

      {/* 下部のコンテンツ */}
      <section className="flex flex-col mt-auto">
        <CardList
          notionData={homeNotionData.map((item) => ({
            ...item,
            isActive: item.link === `/details/${id}`, // 現在の詳細ページのIDと一致するかチェック
          }))}
          openModal={openModal}
        />
      </section>

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
