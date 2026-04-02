interface BadgeProps {
  children: React.ReactNode;
  tone?: "navy" | "gold" | "muted" | "success";
  className?: string;
}

const toneClassName = {
  navy: "bg-navy/8 text-navy",
  gold: "bg-gold-light/70 text-[#8c6b18]",
  muted: "bg-ivory-warm text-text-secondary",
  success: "bg-success/10 text-success",
} as const;

export function Badge({ children, tone = "navy", className }: BadgeProps) {
  return (
    <span
      className={`inline-flex min-h-7 w-fit shrink-0 self-start items-center rounded-full px-3 text-[13px] font-semibold ${toneClassName[tone]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
