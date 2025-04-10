// lib/logger.ts
import { createLogger, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// JST形式のタイムスタンプを生成
const jstTimestamp = () => {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().replace("T", " ").replace("Z", "");
};

// ローテーション設定
const dailyRotateFileTransport = new DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,             // 日付が変わったらzip化
  maxFiles: '10d',                 // 10日間保持
  level: 'info',
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.printf(({ level, message }) => {
      return `${jstTimestamp()} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    dailyRotateFileTransport,
    // 開発中は Console も有効にする
    new (require("winston").transports.Console)(),
  ],
});

export default logger;
