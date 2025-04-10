// lib/logger.ts
import { createLogger, transports, format } from "winston";

// JST形式でタイムスタンプを生成する関数
const jstTimestamp = () => {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  return jst.toISOString().replace("T", " ").replace("Z", "");
};

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.printf(({ level, message }) => {
      return `${jstTimestamp()} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/app.log" }),
  ],
});

export default logger;
