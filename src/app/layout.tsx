import type { Metadata } from "next";
import "./globals.css";
import { SITE_COPY, SITE_NAME } from "@/constants/site";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_COPY.heroDescription,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-ivory font-sans text-text-primary antialiased">{children}</body>
    </html>
  );
}
