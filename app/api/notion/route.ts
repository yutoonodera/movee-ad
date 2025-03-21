import { NextResponse } from "next/server";

export async function POST() {
  const NOTION_API_URL = `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`;

  try {
    const response = await fetch(NOTION_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        sorts: [
          {
            timestamp: "last_edited_time", // ここを timestamp にする
            direction: "descending" // 降順（最新が上）
          }
        ],
        filter: {
          property: "open", // Notionのチェックボックスプロパティ名
          checkbox: {
            equals: true // チェックが入っているもののみ取得
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
console.log(data);
    return NextResponse.json(data);
} catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
