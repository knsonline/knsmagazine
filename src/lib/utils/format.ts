export function formatKoreanDate(dateString: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
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
