import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  process.stderr.write("NEXT_PUBLIC_SUPABASE_URL 과 SUPABASE_SERVICE_ROLE_KEY 를 먼저 설정해 주세요.\n");
  process.exit(1);
}

const seedFile = new URL("../seed-data.json", import.meta.url);
const seedData = JSON.parse(await readFile(seedFile, "utf8"));

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const placeholderImage = "https://placehold.co/600x340/1B2A4A/FAF8F5?text=KNS";

function normalizeThumbnail(url) {
  return typeof url === "string" && url.startsWith("/seed/") ? placeholderImage : url ?? placeholderImage;
}

const ctaRows = seedData.ctas.map((cta) => ({
  id: crypto.randomUUID(),
  label: cta.label,
  url: cta.url,
}));

const consultCta = ctaRows.find((cta) => cta.label.includes("상담")) ?? ctaRows[0];
const seminarCta = ctaRows.find((cta) => cta.label.includes("설명회")) ?? consultCta;

const contentRows = seedData.contents.map((content, index) => {
  const id = crypto.randomUUID();
  const publishedAt = new Date("2026-03-30T09:00:00+09:00");
  publishedAt.setDate(publishedAt.getDate() - index * 3);
  const ctaId =
    content.topic === "입시정보" || content.topic === "특목고" ? seminarCta?.id ?? null : consultCta?.id ?? null;

  return {
    id,
    title: content.title,
    summary: content.summary,
    external_url: content.external_url,
    thumbnail_url: normalizeThumbnail(content.thumbnail_url),
    grade: content.grade,
    topic: content.topic,
    content_type: content.content_type,
    is_published: content.is_published,
    is_featured: content.is_featured,
    is_hero: content.is_hero,
    cta_id: ctaId,
    created_at: publishedAt.toISOString(),
    updated_at: publishedAt.toISOString(),
  };
});

const contentMap = new Map(contentRows.map((content) => [content.title, content]));

const bannerRows = seedData.banners.map((banner) => ({
  id: crypto.randomUUID(),
  image_url: normalizeThumbnail(banner.image_url),
  link_url: banner.link_url,
  starts_at: banner.starts_at ?? null,
  ends_at: banner.ends_at ?? null,
  is_active: banner.is_active,
}));

const collectionRows = seedData.collections.map((collection, index) => ({
  id: crypto.randomUUID(),
  name: collection.name,
  is_visible_home: collection.is_visible_home,
  sort_order: index,
}));

const collectionItemRows = seedData.collections.flatMap((collection, collectionIndex) => {
  const collectionRow = collectionRows[collectionIndex];

  return collection.content_titles.flatMap((title, itemIndex) => {
    const content = contentMap.get(title);

    if (!content) {
      return [];
    }

    return [
      {
        collection_id: collectionRow.id,
        content_id: content.id,
        sort_order: itemIndex,
      },
    ];
  });
});

async function resetTables() {
  const resetSteps = [
    () => supabase.from("events").delete().not("id", "is", null),
    () => supabase.from("collection_items").delete().not("collection_id", "is", null),
    () => supabase.from("collections").delete().not("id", "is", null),
    () => supabase.from("banners").delete().not("id", "is", null),
    () => supabase.from("contents").delete().not("id", "is", null),
    () => supabase.from("ctas").delete().not("id", "is", null),
  ];

  for (const step of resetSteps) {
    const { error } = await step();
    if (error) throw error;
  }
}

async function seed() {
  await resetTables();

  const orderedInserts = [
    () => supabase.from("ctas").insert(ctaRows),
    () => supabase.from("contents").insert(contentRows),
    () => supabase.from("banners").insert(bannerRows),
    () => supabase.from("collections").insert(collectionRows),
  ];

  for (const insert of orderedInserts) {
    const { error } = await insert();

    if (error) {
      throw error;
    }
  }

  if (collectionItemRows.length > 0) {
    const { error } = await supabase.from("collection_items").insert(collectionItemRows);

    if (error) {
      throw error;
    }
  }

  process.stdout.write("Supabase 시드 입력이 완료되었습니다.\n");
  process.stdout.write(
    `콘텐츠 ${contentRows.length}개, CTA ${ctaRows.length}개, 배너 ${bannerRows.length}개, 컬렉션 ${collectionRows.length}개\n`,
  );
}

seed().catch((error) => {
  process.stderr.write("시드 입력 중 오류가 발생했습니다.\n");
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
