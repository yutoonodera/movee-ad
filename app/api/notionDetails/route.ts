// /app/api/notionDetails/route.ts
import logger from "@/app/lib/logger";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    // ページプロパティとブロックの子情報を同時に取得
    const [pageResponse, blockResponse] = await Promise.all([
      fetch(`https://api.notion.com/v1/pages/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
        },
      }),
      fetch(`https://api.notion.com/v1/blocks/${id}/children`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
        },
      }),
    ]);
    logger.info("記事取得API accessed.");
    if (!pageResponse.ok) {
      throw new Error(`Notion Page API request failed with status ${pageResponse.status}`);
    }
    if (!blockResponse.ok) {
      throw new Error(`Notion Blocks API request failed with status ${blockResponse.status}`);
    }

    const [pageData, blockData] = await Promise.all([
      pageResponse.json(),
      blockResponse.json(),
    ]);
    // ページ情報（Name）とブロック情報をまとめて返却
    return NextResponse.json({
      page: pageData,
      blocks: blockData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch Notion data", details: error.message }, { status: 500 });
  }
}
