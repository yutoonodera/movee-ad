// /app/details/[id]/layout.tsx
import { Metadata } from "next";
import * as Constants from '../../constants';

// メタデータ生成 (サーバーサイド)
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // /api/notionDetails からデータを取得
  const res = await fetch(`${process.env.PUBLIC_BASE_URL}/api/notionDetails?id=${params.id}`);

  if (!res.ok) {
    throw new Error(`Notion API request failed: ${res.status}`);
  }

  const notionData = await res.json();
  const pageTitle =
    notionData?.page?.properties?.Name?.title?.[0]?.text?.content || Constants.TITLE;
  const pageDescription =
    notionData?.page?.properties?.description?.rich_text?.[0]?.text?.content || Constants.DESCRIPTION;
  const pageIcon =
    notionData?.page?.properties.icon?.files[0]?.file?.url || Constants.OPEN_GRAPH_IMAGE;
  return {
    title: pageTitle,  // 動的なタイトルを設定
    description: pageDescription,  // description
    openGraph: { // Open Graph メタデータ
      title: pageTitle,
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
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
