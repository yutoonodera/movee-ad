import { createLogger, transports, format } from "winston";

// 日本時間を取得する関数
const getJapanTime = () => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return new Date().toLocaleString('ja-JP', options); // 日本時間に変換
};

const logger = createLogger({
  level: "info",
  format: format.combine(
    // カスタムタイムスタンプで日本時間を使用
    format.timestamp({
      format: getJapanTime
    }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/app.log" }),
  ],
});

export default logger;
