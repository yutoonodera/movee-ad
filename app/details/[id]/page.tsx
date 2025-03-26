"use client";  // クライアントサイドで動作させるためのディレクティブを追加

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { Typography, Spin, Alert } from "antd";
import CardList from "../../components/CardList";
import OGPCard from "../../components/OGPCard";
import "../../globals.css";
import * as Constants from '../../constants'

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

  // カードリストデータを取得
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch("/api/notion", { method: "POST" });
        if (!response.ok) throw new Error("Failed to fetch Notion data");

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
        const data = await response.json();
        console.log(data);
        const extractedData = data.results.map((item: any) => ({
          title: item.properties.Name?.title[0]?.text?.content || Constants.TITLE,
          updateUser: item.properties.updatedUser?.last_edited_by?.name || Constants.MOVEE_USER,
          lastEditBy: formatLastEditedTime(item.last_edited_time), // JSTで処理済みのテキスト
          icon: item.properties.icon?.files[0]?.file?.url || "", // アイコンURLを絶対URLに変換
          link: `/details/${item.id}`,
        }));

        setHomeNotionData(extractedData);
      } catch (error) {
        console.error("Notion APIの取得エラー:", error);
      }
    };

    fetchHomeData();
  }, []);

  const handleNavigate = (link: string) => {
    router.push(link);
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
            {/* H1ブロック */}
            {block.heading_1?.rich_text?.map((text: any) => (
              <Title level={2} key={text.text?.content}>
                {text.text?.content }
              </Title>
            ))}
            {/* テキストブロック */}
            {block.paragraph?.rich_text?.map((text: any) => (
              <Paragraph key={text.text?.content}>
                {text.text?.content }
              </Paragraph>
            ))}
            {/* URLブロック */}
            {block.paragraph?.rich_text?.map((text: any) => {
              const url = text.href;
              return url ? (
                <OGPCard key={text.text?.content} url={url} />
              ) : (
                <Paragraph key={text.text?.content}></Paragraph>
              );
            })}

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
          onCardClick={handleNavigate}
        />
      </section>
    </main>
  );
}
