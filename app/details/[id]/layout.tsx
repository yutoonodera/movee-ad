// app/details/[id]/layout.tsx

import { Metadata } from "next";
import * as Constants from '../../constants';
// メタデータ生成 (サーバーサイド)
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const res = await fetch(`https://api.notion.com/v1/pages/${params.id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
    },
  });

  if (!res.ok) {
    throw new Error(`Notion API request failed: ${res.status}`);
  }

  const pageData = await res.json();
  console.log(pageData);
  const pageTitle =
    pageData?.properties?.Name?.title?.[0]?.text?.content || Constants.TITLE;
  const pageDescription =
    pageData?.properties?.description?.rich_text?.[0]?.text?.content || Constants.DESCRIPTION;
  return {
    title: pageTitle,  // 動的なタイトルを設定
    description: pageDescription,  // description
    openGraph: { // Open Graph メタデータ
        title: pageTitle,
        description: pageDescription,
        images:[
            {
                url: Constants.OPEN_GRAPH_IMAGE,
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
