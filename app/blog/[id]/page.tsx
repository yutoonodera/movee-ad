"use client";  // クライアントサイドで動作させるためのディレクティブを追加

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { Typography, Spin, Alert } from "antd";
import CardList from "../../components/CardList";
import OGPCard from "../../components/OGPCard";
import { formatDaytoDayAgo } from "../../utils/timeFormatter";
import "../../globals.css";
import * as Constants from '../../constants'
import { FINISH_GREETING } from "../../constants";

const { Title, Paragraph } = Typography;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: notionDetails, error, isLoading } = useSWR(
    id ? `/api/notionDetails?id=${id}` : null,
    fetcher
  );

  const [notionData, setNotionData] = useState<{ title: string; updateUser: string; lastEditBy: string; icon: string; link: string }[]>([]);

  useEffect(() => {
    const fetchNotionData = async () => {
      try {
        const response = await fetch("/api/notion", { method: "POST" });
        if (!response.ok) throw new Error("Failed to fetch Notion data");
        const data = await response.json();
        const extractedData = data.results.map((item: any) => ({
          title: item.properties.Name.title[0]?.text?.content || Constants.TITLE,
          updateUser: item.properties.updatedUser?.last_edited_by?.name || Constants.MOVEE_USER,
          lastEditBy: formatDaytoDayAgo(item.last_edited_time), // JSTで処理済みのテキスト
          icon: item.properties?.icon?.select?.name
            ? `/images/eyecatch/${item.properties.icon.select.name}.png`
            : Constants.OPEN_GRAPH_IMAGE, // アイコンURLを絶対URLに変換
          link: `/blog/${item.id}`,
        }));
        setNotionData(extractedData);
      } catch (error) {
        console.error("Notion APIの取得エラー:", error);
      }
    };

    fetchNotionData();
  }, []);

  const handleNavigate = (link: string) => {
    router.push(link);
  };

  // ローディング中やエラー時に表示する
  if (isLoading) return <Spin size="large" />;
  if (error) return <Alert message="データの取得に失敗しました" type="error" showIcon />;

  // notionDetailsが非公開かnullの場合にメッセージを表示
  if (!notionDetails || !notionDetails?.page?.properties?.open?.checkbox) {
    return (
      <main className="flex flex-col justify-between min-h-screen p-6 max-w-3xl mx-auto">
        <Paragraph>申し訳ありません。この記事は削除されたか、現在非公開中のため、読むことができません。</Paragraph>
        <Paragraph>よければ、他の記事をお楽しみください📖</Paragraph>
        <section className="flex flex-col mt-auto">
          <CardList notionData={notionData.map((item) => ({ ...item, isActive: item.link === `/blog/${id}` }))} onCardClick={handleNavigate} />
        </section>
      </main>
    );
  }

  // renderBlock 関数を定義して、各ブロックのレンダリング処理を分ける
  const renderBlock = (block: any) => {
    const { type, id } = block;

    const textElements = (block[type]?.rich_text || []).map((text: any, i: number) => (
      <React.Fragment key={`${id}-text-${i}`}>
        {text.href ? <a href={text.href}>{text.plain_text}</a> : text.plain_text}
      </React.Fragment>
    ));

    switch (type) {
      case "heading_1":
        return <Title level={2} key={id}>{textElements}</Title>;
      case "heading_2":
        return <Title level={3} key={id}>{textElements}</Title>;
      case "heading_3":
        return <Title level={4} key={id}>{textElements}</Title>;
      case "paragraph":
        return <Paragraph key={id}>{textElements}</Paragraph>;
      case "bulleted_list_item":
      //numbered_list_itemは個別実装が必要なため、bulleted_list_itemとして表示
      case "numbered_list_item":
        return <li key={id}>{textElements}</li>;
      case "code":
        return (
          <pre key={id} style={{ background: "#f5f5f5", padding: "1rem", overflowX: "auto" }}>
            <code>{block.code?.rich_text?.map((t: any) => t.plain_text).join("")}</code>
          </pre>
        );
      case "image":
        return (
          <div key={id} style={{ marginBottom: "20px" }}>
            <img
              src={block.image.file?.url || block.image.external?.url}
              alt={block.image.caption?.[0]?.plain_text || "画像"}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        );
      case "quote":
        return (
          <blockquote key={id} style={{ fontStyle: "italic", borderLeft: "4px solid #ccc", paddingLeft: "1rem", marginLeft: "0" }}>
            {textElements}
          </blockquote>
        );
      case "to_do":
        return (
          <div key={id}>
            <input type="checkbox" checked={block.to_do?.checked} readOnly /> {textElements}
          </div>
        );
    }
  };

  return (
    <main className="flex flex-col justify-between min-h-screen p-6 max-w-3xl mx-auto">
      <Paragraph>
        （最終更新日: {notionDetails?.page?.last_edited_time ? formatDaytoDayAgo(notionDetails.page.last_edited_time) : "不明"}）
      </Paragraph>
      <Paragraph>
        こんにちは、株式会社moveeの {notionDetails?.page?.properties?.updatedUser?.last_edited_by?.name || "moveeユーザー"}です。
      </Paragraph>
      <Paragraph>
        このページは<strong>{notionDetails?.page?.properties?.Name?.title[0]?.text?.content || "タイトルなし"}</strong>について、です。
      </Paragraph>

      <section>
        {notionDetails?.blocks?.results?.map((block: any) => renderBlock(block))}
      </section>

      <Paragraph>{FINISH_GREETING}</Paragraph>
      <div className="mt-8" />
      <section className="flex flex-col mt-auto">
        <CardList notionData={notionData.map((item) => ({ ...item, isActive: item.link === `/blog/${id}` }))} onCardClick={handleNavigate} />
      </section>
      <h1 className="text-2xl font-bold text-center mt-8 mb-6">{Constants.CATCH_COPY}</h1>
    </main>
  );
}
