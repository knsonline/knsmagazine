import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        navy: "#1B2A4A",
        "navy-light": "#2A3F6A",
        ivory: "#FAF8F5",
        "ivory-warm": "#F5F0EB",
        gold: "#C8A951",
        "gold-light": "#E8D5A0",
        "text-primary": "#1D1D1F",
        "text-secondary": "#6B7280",
        "text-muted": "#9CA3AF",
        success: "#059669",
        warning: "#D97706",
        error: "#DC2626",
        "cta-primary": "#1B2A4A",
        "cta-accent": "#C8A951",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 18px 44px -28px rgba(27, 42, 74, 0.28)",
      },
      borderRadius: {
        card: "1.5rem",
      },
    },
  },
} satisfies Config;

export default config;
