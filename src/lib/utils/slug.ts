export function slugify(input: string, fallback: string): string {
  const normalized = input
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

  return normalized.length > 0 ? normalized : fallback;
}

export function getIdSlugPrefix(id: string): string {
  return id.slice(0, 8);
}
