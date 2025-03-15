import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const cursor = searchParams.get("cursor") || ""; // ページネーション用カーソル

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const notionResponse = await fetch(
      `https://api.notion.com/v1/blocks/${id}/children?page_size=10${cursor ? `&start_cursor=${cursor}` : ""}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
        },
      }
    );

    if (!notionResponse.ok) {
      throw new Error(`Notion API request failed with status ${notionResponse.status}`);
    }

    const data = await notionResponse.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch Notion data", details: error.message },
      { status: 500 }
    );
  }
}
