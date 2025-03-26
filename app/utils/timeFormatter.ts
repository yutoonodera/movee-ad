// utils/timeFormatter.ts
export const formatDaytoDayAgo = (utcTime: string): string => {
  const lastEditTime = new Date(utcTime);
  const lastEditJST = new Date(lastEditTime.getTime() + 9 * 60 * 60 * 1000);
  const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000);

  const timeDifference = nowJST.getTime() - lastEditJST.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  if (hoursDifference < 24) return "本日";
  if (hoursDifference < 48) return "1日前";
  if (hoursDifference < 72) return "2日前";
  if (hoursDifference < 96) return "3日前";
  if (hoursDifference < 120) return "4日前";
  if (hoursDifference < 144) return "5日前";
  if (hoursDifference < 168) return "6日前";
  if (hoursDifference < 192) return "1週間前";
  if (hoursDifference < 312) return "2週間前";
  if (hoursDifference < 480) return "3週間前";
  if (hoursDifference < 696) return "1ヶ月前";
  if (hoursDifference < 1416) return "2ヶ月前";
  if (hoursDifference < 2136) return "3ヶ月前";
  if (hoursDifference < 2856) return "4ヶ月前";
  if (hoursDifference < 3576) return "5ヶ月前";
  if (hoursDifference < 4296) return "6ヶ月前";
  return "1年以上前";
};
