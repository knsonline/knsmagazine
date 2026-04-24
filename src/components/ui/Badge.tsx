import type { Grade, Topic } from "@/types/content";

interface BadgeProps {
  children: React.ReactNode;
  tone?: "navy" | "gold" | "muted" | "success";
  className?: string;
}

type BadgeContext = "light" | "dark";
type SpecialBadgeKey = "coverStory";

const toneClassName = {
  navy: "border border-navy/10 bg-[rgba(233,239,247,0.96)] text-navy",
  gold: "border border-[#d8c08a] bg-[rgba(242,234,214,0.92)] text-[#7d6325]",
  muted: "border border-[#d9e3ef] bg-[rgba(239,244,250,0.98)] text-[#5a687c]",
  success: "border border-success/10 bg-success/10 text-success",
} as const;

const gradeBadgeClassNames: Record<BadgeContext, Record<Grade, string>> = {
  light: {
    초등: "border-[#adc9ef] bg-[#dceafe] text-[#214b78]",
    중등: "border-[#adcab7] bg-[#deefe5] text-[#214b36]",
    예비고1: "border-[#d8b483] bg-[#f4e2cc] text-[#6f4824]",
    고등: "border-[#bccbdd] bg-[#e1eaf4] text-[#334a67]",
    공통: "border-[#cfbeb5] bg-[#ebe2de] text-[#5f4841]",
  },
  dark: {
    초등:
      "border-[#a9c7ed]/78 bg-[linear-gradient(180deg,rgba(230,240,253,0.97),rgba(210,225,244,0.95))] text-[#1f446e] shadow-[0_16px_30px_-24px_rgba(8,16,30,0.48)] backdrop-blur-md",
    중등:
      "border-[#accab7]/78 bg-[linear-gradient(180deg,rgba(231,241,234,0.97),rgba(211,228,219,0.95))] text-[#224c37] shadow-[0_16px_30px_-24px_rgba(8,16,30,0.48)] backdrop-blur-md",
    예비고1:
      "border-[#d5b17f]/78 bg-[linear-gradient(180deg,rgba(249,239,225,0.97),rgba(238,222,198,0.95))] text-[#6d461f] shadow-[0_16px_30px_-24px_rgba(8,16,30,0.48)] backdrop-blur-md",
    고등:
      "border-[#b7c9dc]/78 bg-[linear-gradient(180deg,rgba(232,238,247,0.97),rgba(216,226,239,0.95))] text-[#334a66] shadow-[0_16px_30px_-24px_rgba(8,16,30,0.48)] backdrop-blur-md",
    공통:
      "border-[#ccb9b1]/78 bg-[linear-gradient(180deg,rgba(243,236,233,0.97),rgba(232,221,216,0.95))] text-[#59443e] shadow-[0_16px_30px_-24px_rgba(8,16,30,0.48)] backdrop-blur-md",
  },
};

const topicBadgeClassNames: Record<BadgeContext, Record<Topic, string>> = {
  light: {
    내신: "border-[#afc9ee] bg-[#ddeafe] text-[#224c78]",
    수능: "border-[#bec9db] bg-[#e3eaf4] text-[#344964]",
    특목고: "border-[#d8bcb0] bg-[#f1e2db] text-[#74473b]",
    학습법: "border-[#b0cdbb] bg-[#e0efe6] text-[#244b39]",
    입시정보: "border-[#ddc287] bg-[#f4e6c6] text-[#6f531f]",
    기타: "border-[#d2c6bf] bg-[#ece5e1] text-[#594f4c]",
  },
  dark: {
    내신:
      "border-[#aac8ee]/78 bg-[linear-gradient(180deg,rgba(230,240,253,0.97),rgba(210,225,244,0.95))] text-[#21466f] shadow-[0_16px_30px_-24px_rgba(8,16,30,0.48)] backdrop-blur-md",
    수능:
      "border-[#b9c6da]/78 bg-[linear-gradient(180deg,rgba(233,238,247,0.97),rgba(216,226,239,0.95))] text-[#374b65] shadow-[0_16px_30px_-24px_rgba(8,16,30,0.48)] backdrop-blur-md",
    특목고:
      "border-[#d6b7ac]/78 bg-[linear-gradient(180deg,rgba(246,237,233,0.97),rgba(236,223,217,0.95))] text-[#704338] shadow-[0_16px_30px_-24px_rgba(8,16,30,0.48)] backdrop-blur-md",
    학습법:
      "border-[#abcab7]/78 bg-[linear-gradient(180deg,rgba(231,241,234,0.97),rgba(212,228,220,0.95))] text-[#234b38] shadow-[0_16px_30px_-24px_rgba(8,16,30,0.48)] backdrop-blur-md",
    입시정보:
      "border-[#ddbf80]/78 bg-[linear-gradient(180deg,rgba(248,241,225,0.97),rgba(238,226,192,0.95))] text-[#6c511c] shadow-[0_16px_30px_-24px_rgba(8,16,30,0.48)] backdrop-blur-md",
    기타:
      "border-[#cdbfb8]/78 bg-[linear-gradient(180deg,rgba(243,237,234,0.97),rgba(231,222,217,0.95))] text-[#564c49] shadow-[0_16px_30px_-24px_rgba(8,16,30,0.48)] backdrop-blur-md",
  },
};

const specialBadgeClassNames: Record<BadgeContext, Record<SpecialBadgeKey, string>> = {
  light: {
    coverStory: "border-[#dbc386] bg-[rgba(247,239,216,0.94)] text-[#715924]",
  },
  dark: {
    coverStory:
      "border-[#e5cf9a]/76 bg-[linear-gradient(180deg,rgba(251,247,237,0.98),rgba(243,234,212,0.96))] text-[#715924] shadow-[0_16px_30px_-24px_rgba(8,16,30,0.48)] backdrop-blur-md",
  },
};

export function getGradeBadgeClassName(grade: Grade, context: BadgeContext = "light"): string {
  return gradeBadgeClassNames[context][grade];
}

export function getTopicBadgeClassName(topic: Topic, context: BadgeContext = "light"): string {
  return topicBadgeClassNames[context][topic];
}

export function getSpecialBadgeClassName(key: SpecialBadgeKey, context: BadgeContext = "light"): string {
  return specialBadgeClassNames[context][key];
}

export function Badge({ children, tone = "navy", className }: BadgeProps) {
  return (
    <span
      className={`text-label inline-flex min-h-7 w-fit shrink-0 self-start items-center rounded-full px-3 text-[13px] font-semibold ${toneClassName[tone]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
