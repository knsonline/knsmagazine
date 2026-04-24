import type { Grade } from "@/types/content";

export const SITE_NAME = "KNS 매거진";

export const GRADE_PAGE_DESCRIPTIONS: Record<Exclude<Grade, "공통">, string> = {
  초등: "기초 습관과 학습 자신감을 먼저 세우는 흐름을 모았습니다.",
  중등: "내신과 방향 설정이 동시에 필요한 시기의 콘텐츠를 담았습니다.",
  예비고1: "중등에서 고등으로 넘어가는 전환기를 준비하는 흐름입니다.",
  고등: "입시 전략과 학습 밀도를 함께 챙겨야 할 시기의 콘텐츠입니다.",
};

export const SITE_COPY = {
  brandLine: "학부모가 먼저 찾는 영어 입시 매거진",
  heroTitle: "KNS 매거진",
  heroDescription: "학년과 주제를 따라 필요한 교육 콘텐츠를 차분하게 골라보세요.",
  heroPrimaryLabel: "바로 읽기",
  heroSecondaryLabel: "전체 콘텐츠",
  heroFallbackPrimaryLabel: "최신 콘텐츠 보기",
  heroFallbackSecondaryLabel: "콘텐츠 검색",
  homeGradeTitle: "학년별로 보기",
  homeGradeDescription: "우리 아이 학년에 맞는 흐름부터 가볍게 시작해 보세요.",
  softCtaTitle: "읽은 내용을 우리 아이에게 어떻게 적용할지 이어서 물어보세요",
  softCtaDescription:
    "학년과 현재 고민에 맞춰 다음에 무엇을 살펴보면 좋을지 차분하게 안내해 드립니다.",
  footerDescription: "학부모가 먼저 찾는 영어 입시 매거진",
  emptyTitle: "아직 준비된 콘텐츠가 없어요.",
  emptyDescription: "조금만 기다려 주세요. 곧 정돈된 콘텐츠로 찾아뵙겠습니다.",
  trendingTitle: "지금 많이 보는 콘텐츠",
  latestTitle: "최신 콘텐츠",
  latestDescription: "방금 들어온 콘텐츠를 시간순으로 차분하게 훑어보세요.",
  contentsDescription: "최신순으로 정리한 KNS 매거진 아카이브입니다.",
  searchTitle: "콘텐츠 검색",
  searchDescription: "주제를 먼저 고르거나 검색어를 더해 필요한 콘텐츠를 빠르게 찾아보세요.",
  searchTopicTitle: "자주 찾는 주제",
  searchTopicDescription: "주제를 먼저 고른 뒤 검색어를 더하면 더 빠르게 찾을 수 있습니다.",
  searchFallbackTitle: "먼저 많이 읽는 콘텐츠",
  trending: {
    description: "지금 학부모의 관심이 가장 빠르게 모이는 콘텐츠입니다.",
    emptyTitle: "인기 콘텐츠를 준비 중입니다.",
    emptyDescription: "조금 더 운영되면 많이 찾는 콘텐츠를 여기에서 먼저 소개해 드릴게요.",
  },
  collections: {
    description: "한 주제를 대표 기사와 함께 이어 읽어 보세요.",
    previewEmptyTitle: "대표 콘텐츠부터 먼저 읽어 보세요.",
    previewEmptyDescription: "이 컬렉션은 핵심 콘텐츠를 중심으로 순차적으로 채워집니다.",
    pageDescription: "한 주제를 한 흐름으로 읽을 수 있도록 엮은 큐레이션 묶음입니다.",
    pageEmptyTitle: "컬렉션을 준비 중입니다.",
    pageEmptyDescription: "곧 관련 콘텐츠를 정리해 보여드릴게요.",
  },
  banners: {
    title: "설명회와 주요 안내",
    description: "설명회, 신청, 프로그램 안내를 한눈에 살펴보세요.",
    cardDescription: "배너를 눌러 자세한 안내를 확인해 보세요.",
  },
} as const;

export const SECTION_LINK_LABEL = "전체보기";
export const LATEST_PAGE_SIZE = 8;
