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
const trackRows = [
  {
    id: crypto.randomUUID(),
    slug: "elementary",
    name: "초등관",
    description: "초등 학부모님의 기초 영어 학습 흐름과 상담 반응을 보는 운영 축입니다.",
    default_phone: "02-555-1201",
    default_consult_url: "https://kns-consult.example.com/elementary",
    notes: "초등 운영 메모",
  },
  {
    id: crypto.randomUUID(),
    slug: "middle_grade1",
    name: "중1관",
    description: "중1 내신 적응과 설명회 반응을 보는 운영 축입니다.",
    default_phone: "02-555-1202",
    default_consult_url: "https://kns-consult.example.com/middle-grade1",
    notes: "중1 운영 메모",
  },
  {
    id: crypto.randomUUID(),
    slug: "high",
    name: "고등관",
    description: "중2·중3·고1~3 입시 대비 운영 축입니다.",
    default_phone: "02-555-1203",
    default_consult_url: "https://kns-consult.example.com/high",
    notes: "고등 운영 메모",
  },
  {
    id: crypto.randomUUID(),
    slug: "common",
    name: "공통",
    description: "특정 관으로 분류되지 않는 공통 운영 자산입니다.",
    default_phone: "02-555-1200",
    default_consult_url: "https://kns-consult.example.com",
    notes: "공통 운영 메모",
  },
];

const trackMap = new Map(trackRows.map((track) => [track.slug, track]));

function normalizeThumbnail(url) {
  return typeof url === "string" && url.startsWith("/seed/") ? placeholderImage : url ?? placeholderImage;
}

function getTrackForGrade(grade) {
  if (grade === "초등") return trackMap.get("elementary");
  if (grade === "중등") return trackMap.get("middle_grade1");
  if (grade === "예비고1" || grade === "고등") return trackMap.get("high");
  return trackMap.get("common");
}

const ctaRows = seedData.ctas.map((cta) => ({
  id: crypto.randomUUID(),
  label: cta.label,
  url: cta.url,
  kind: cta.kind,
  consult_segment: cta.consult_segment ?? null,
}));

const consultCta = ctaRows.find((cta) => cta.label.includes("상담")) ?? ctaRows[0];
const seminarCta = ctaRows.find((cta) => cta.label.includes("설명회")) ?? consultCta;
const diagnosisCta = ctaRows.find((cta) => cta.label.includes("진단")) ?? consultCta;

const conversionTargetRows = [
  {
    id: consultCta.id,
    label: consultCta.label,
    description: "대표 상담 전환 자산",
    type: "상담신청",
    track_id: trackMap.get("common").id,
    destination_url: consultCta.url,
    is_active: true,
    starts_at: null,
    ends_at: null,
    owner_label: "운영자",
    redirect_code: "seed-consult",
    notes: "공통 상담 전환 자산",
  },
  {
    id: seminarCta.id,
    label: seminarCta.label,
    description: "대표 설명회 전환 자산",
    type: "현장설명회",
    track_id: trackMap.get("middle_grade1").id,
    destination_url: seminarCta.url,
    is_active: true,
    starts_at: "2026-04-01",
    ends_at: "2026-06-30",
    owner_label: "운영자",
    redirect_code: "seed-seminar",
    notes: "설명회 전환 자산",
  },
  {
    id: diagnosisCta.id,
    label: diagnosisCta.label,
    description: "학습 진단 전환 자산",
    type: "프로그램문의",
    track_id: trackMap.get("common").id,
    destination_url: diagnosisCta.url,
    is_active: true,
    starts_at: null,
    ends_at: null,
    owner_label: "운영자",
    redirect_code: "seed-diagnosis",
    notes: "진단 전환 자산",
  },
  {
    id: crypto.randomUUID(),
    label: "초등관 상담 연결",
    description: "초등관 대표 상담 자산",
    type: "상담신청",
    track_id: trackMap.get("elementary").id,
    destination_url: "https://kns-consult.example.com/elementary",
    is_active: true,
    starts_at: null,
    ends_at: null,
    owner_label: "운영자",
    redirect_code: "seed-elementary-consult",
    notes: "초등관 전용",
  },
  {
    id: crypto.randomUUID(),
    label: "고등관 바로 전화 연결",
    description: "고등관 문의 전용 전화 자산",
    type: "전화연결",
    track_id: trackMap.get("high").id,
    destination_url: "tel:025551203",
    is_active: true,
    starts_at: null,
    ends_at: null,
    owner_label: "운영자",
    redirect_code: "seed-high-call",
    notes: "고등관 전용",
  },
  {
    id: crypto.randomUUID(),
    label: "고등관 시간표 보기",
    description: "고등관 시간표 안내 자산",
    type: "시간표안내",
    track_id: trackMap.get("high").id,
    destination_url: "https://kns-program.example.com/high-schedule",
    is_active: true,
    starts_at: null,
    ends_at: null,
    owner_label: "운영자",
    redirect_code: "seed-high-schedule",
    notes: "고등관 전용",
  },
];

const contentRows = seedData.contents.map((content, index) => {
  const id = crypto.randomUUID();
  const publishedAt = new Date("2026-03-30T09:00:00+09:00");
  publishedAt.setDate(publishedAt.getDate() - index * 3);
  const track = getTrackForGrade(content.grade);
  const primaryConversionTargetId =
    content.topic === "입시정보" || content.topic === "특목고"
      ? seminarCta?.id ?? null
      : content.grade === "고등" || content.grade === "예비고1"
        ? conversionTargetRows.find((target) => target.redirect_code === "seed-high-schedule")?.id ?? consultCta?.id ?? null
        : consultCta?.id ?? null;

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
    track_id: track?.id ?? null,
    primary_conversion_target_id: primaryConversionTargetId,
    cta_id: primaryConversionTargetId,
    created_at: publishedAt.toISOString(),
    updated_at: publishedAt.toISOString(),
  };
});

const contentMap = new Map(contentRows.map((content) => [content.title, content]));

const bannerRows = seedData.banners.map((banner) => ({
  id: crypto.randomUUID(),
  title: banner.title,
  image_url: normalizeThumbnail(banner.image_url),
  link_url: banner.link_url,
  starts_at: banner.starts_at ?? null,
  ends_at: banner.ends_at ?? null,
  is_active: banner.is_active,
  track_id: trackMap.get("common").id,
  conversion_target_id: seminarCta.id,
}));

const scheduleRows = [
  {
    id: crypto.randomUUID(),
    track_id: trackMap.get("elementary").id,
    label: "초등 기초 영어반",
    day_of_week: "월/수",
    starts_at: "16:00",
    ends_at: "18:00",
    location_label: "초등관 3층",
    is_visible: true,
    sort_order: 1,
  },
  {
    id: crypto.randomUUID(),
    track_id: trackMap.get("middle_grade1").id,
    label: "중1 내신 집중반",
    day_of_week: "화/목",
    starts_at: "18:00",
    ends_at: "20:00",
    location_label: "중등관 2층",
    is_visible: true,
    sort_order: 1,
  },
  {
    id: crypto.randomUUID(),
    track_id: trackMap.get("high").id,
    label: "고등 수능 전략반",
    day_of_week: "토",
    starts_at: "13:00",
    ends_at: "17:00",
    location_label: "고등관 세미나실",
    is_visible: true,
    sort_order: 1,
  },
];

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
    () => supabase.from("program_schedules").delete().not("id", "is", null),
    () => supabase.from("collection_items").delete().not("collection_id", "is", null),
    () => supabase.from("collections").delete().not("id", "is", null),
    () => supabase.from("banners").delete().not("id", "is", null),
    () => supabase.from("contents").delete().not("id", "is", null),
    () => supabase.from("conversion_targets").delete().not("id", "is", null),
    () => supabase.from("program_tracks").delete().not("id", "is", null),
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
    () => supabase.from("program_tracks").insert(trackRows),
    () => supabase.from("ctas").insert(ctaRows),
    () => supabase.from("conversion_targets").insert(conversionTargetRows),
    () => supabase.from("contents").insert(contentRows),
    () => supabase.from("banners").insert(bannerRows),
    () => supabase.from("collections").insert(collectionRows),
    () => supabase.from("program_schedules").insert(scheduleRows),
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
    `관 ${trackRows.length}개, 전환 자산 ${conversionTargetRows.length}개, 콘텐츠 ${contentRows.length}개, 배너 ${bannerRows.length}개, 컬렉션 ${collectionRows.length}개\n`,
  );
}

seed().catch((error) => {
  process.stderr.write("시드 입력 중 오류가 발생했습니다.\n");
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
