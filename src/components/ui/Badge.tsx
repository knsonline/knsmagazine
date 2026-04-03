interface BadgeProps {
  children: React.ReactNode;
  tone?: "navy" | "gold" | "muted" | "success";
  className?: string;
}

const toneClassName = {
  navy: "border border-navy/10 bg-[rgba(233,239,247,0.96)] text-navy",
  gold: "border border-[#d8c08a] bg-[rgba(242,234,214,0.92)] text-[#7d6325]",
  muted: "border border-[#d9e3ef] bg-[rgba(239,244,250,0.98)] text-[#5a687c]",
  success: "border border-success/10 bg-success/10 text-success",
} as const;

export function Badge({ children, tone = "navy", className }: BadgeProps) {
  return (
    <span
      className={`text-label inline-flex min-h-7 w-fit shrink-0 self-start items-center rounded-full px-3 text-[13px] font-semibold ${toneClassName[tone]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
