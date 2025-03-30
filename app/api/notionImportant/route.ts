import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CACHE_FILE_PATH = path.join(process.cwd(), "public", "importantdata.json");
const UPDATE_INTERVAL = 86400000; // 24時間ごとに更新（1日 = 86400000ミリ秒）
let lastUpdated = 0;

// Notion APIからデータ取得
async function fetchNotionData() {
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
            timestamp: "last_edited_time",
            direction: "descending"
          }
        ],
        filter: {
          and: [
            {
              property: "open",
              checkbox: {
                equals: true
              }
            },
            {
              property: "important",
              checkbox: {
                equals: true
              }
            }
          ]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // キャッシュとしてJSONファイルに保存
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify({ data, timestamp: Date.now() }, null, 2));

    console.log("Notionデータを更新しました:", new Date().toLocaleString());
    return data;
  } catch (error: any) {
    console.error("Notion APIの取得エラー:", error.message);
    return null;
  }
}

// 24時間ごとにNotionデータを更新
setInterval(async () => {
  const now = Date.now();
  if (now - lastUpdated >= UPDATE_INTERVAL) {
    lastUpdated = now;
    await fetchNotionData();
  }
}, UPDATE_INTERVAL);

// APIのエンドポイント
export async function POST() {
  try {
    // キャッシュファイルを読み込む
    const cacheExists = await fs.access(CACHE_FILE_PATH).then(() => true).catch(() => false);

    if (cacheExists) {
      const cacheData = JSON.parse(await fs.readFile(CACHE_FILE_PATH, "utf-8"));
      return NextResponse.json(cacheData.data);
    }

    // キャッシュがない場合はAPIから取得
    const freshData = await fetchNotionData();
    if (!freshData) throw new Error("Failed to fetch Notion data");

    return NextResponse.json(freshData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
