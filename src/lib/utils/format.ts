const KST_TIMEZONE = "Asia/Seoul";

export function formatKoreanDate(dateString: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function getKstDateKey(date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: KST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
}

export function formatKstMonthDay(date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIMEZONE,
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date).replace(". ", "/").replace(".", "");
}

export function formatKstMonthDayWithWeekday(date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: KST_TIMEZONE,
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });

  const parts = formatter.formatToParts(date);
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";

  return `${month}/${day} (${weekday})`;
}

export function getKstStartOfDay(date = new Date()): Date {
  const dateKey = getKstDateKey(date);
  return new Date(`${dateKey}T00:00:00+09:00`);
}

export function getKstStartOfDaysAgo(daysAgo: number, baseDate = new Date()): Date {
  const start = getKstStartOfDay(baseDate);
  start.setTime(start.getTime() - daysAgo * 86400000);
  return start;
}

export function getPlaceholderImage(seedValue: string | null | undefined): string {
  if (!seedValue || seedValue.startsWith("/seed/")) {
    return "https://placehold.co/600x340/1B2A4A/FAF8F5?text=KNS";
  }

  return seedValue;
}

export function clampPage(rawValue: string | undefined, maxPage: number): number {
  const page = Number(rawValue ?? "1");

  if (Number.isNaN(page) || page < 1) {
    return 1;
  }

  if (page > maxPage) {
    return maxPage;
  }

  return page;
}

export function startOfDay(date = new Date()) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function startOfDaysAgo(daysAgo: number) {
  const date = startOfDay();
  date.setDate(date.getDate() - daysAgo);
  return date;
}
