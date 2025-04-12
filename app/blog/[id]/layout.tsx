export const revalidate = 3600;  // ページ情報をキャッシュし、1時間ごとに再取得
import { Metadata } from "next";
import * as Constants from '../../constants';
import logger from "@/app/lib/logger";

// メタデータ生成 (サーバーサイド)
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  logger.info("🎯 generateMetadata呼び出し", params.id);
  // /api/notionDetails からデータを取得
  const res = await fetch(`${process.env.PUBLIC_BASE_URL}/api/notionDetails?id=${params.id}`,
  {
    next: { revalidate: 3600 }  // generateMetadataは動的フェッチのため、revalidateは効かないのでgenerateMetadata内でも設定する
  }
  );

  if (!res.ok) {
    logger.info(`Notion API request failed: ${res.status}`);
  }

  const notionData = await res.json();
  const pageTitle =
    notionData?.page?.properties?.Name?.title?.[0]?.text?.content || Constants.TITLE;
  const pageDescription =
    notionData?.page?.properties?.description?.rich_text?.[0]?.text?.content || Constants.DESCRIPTION;
  const iconName = notionData?.page?.properties?.icon?.select?.name;
  const pageIcon = iconName ? `/images/eyecatch/${iconName}.png` : Constants.OPEN_GRAPH_IMAGE;
  const pageTitleWithUpdateUser =
    pageTitle + " by " + notionData?.page?.properties?.updatedUser?.last_edited_by?.name || Constants.MOVEE_USER;
  return {
    title: pageTitle,  // 動的なタイトルを設定
    description: pageDescription,  // description
    openGraph: { // Open Graph メタデータ
      title: pageTitleWithUpdateUser,
      description: pageDescription,
      images: [
        {
          url: pageIcon,
          width: Constants.OPEN_GRAPH_IMAGE_WIDTH,
          height: Constants.OPEN_GRAPH_IMAGE_HEIGHT,
          alt: pageTitle,
        },
      ],
    },
    twitter: { // X（Twitter）向けのOGP設定
      card: "summary", // 画像付きカード
      title: pageTitleWithUpdateUser ,
      description: pageDescription,
      images: [pageIcon], // Twitterは配列ではなく単一URLを期待するが、Next.jsのMetadata型では配列を受け付ける
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
