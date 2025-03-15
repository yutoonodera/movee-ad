"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Typography, Spin, Alert } from "antd";

const { Title, Paragraph } = Typography;

export default function DetailsPage() {
  const { id } = useParams(); // URLパラメータから `id` を取得
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notionData, setNotionData] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/notionDetails?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch Notion details");

        const data = await response.json();
        setNotionData(data);
      } catch (err) {
        setError("データの取得に失敗しました");
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" showIcon />;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Title level={2}>Notion詳細ページ</Title>
      {notionData?.results?.map((block: any) => (
        <div key={block.id}>
          {/* Heading 1 ブロックの表示 */}
          {block.heading_1?.rich_text?.map((text: any) => (
            <Title level={1} key={text.text.content}>
              {text.text.content || "データなし"}
            </Title>
          ))}

          {/* Heading 2 ブロックの表示 */}
          {block.heading_2?.rich_text?.map((text: any) => (
            <Title level={2} key={text.text.content}>
              {text.text.content || "データなし"}
            </Title>
          ))}

          {/* Paragraph ブロックの表示 */}
          {block.paragraph?.rich_text?.map((text: any) => (
            <Paragraph key={text.text.content}>
              {text.text.content || "データなし"}
            </Paragraph>
          ))}

          {/* Code ブロックの表示 */}
          {block.code?.rich_text?.map((text: any) => (
            <pre key={text.text.content} className="bg-gray-200 p-2 rounded-md">
              <code>{text.text.content || "データなし"}</code>
            </pre>
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
    </main>
  );
}
