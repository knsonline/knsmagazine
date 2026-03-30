import type { Metadata } from "next";
import "./globals.css";
import { MobileNav } from "@/components/layout/MobileNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopPromoBanner } from "@/components/layout/TopPromoBanner";
import { SITE_COPY, SITE_NAME } from "@/constants/site";
import { getActiveBanners, getPrimaryConsultCta } from "@/lib/data/content";

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
  const topBanner = (await getActiveBanners())[0];
  const consultCta = await getPrimaryConsultCta();

  return (
    <html lang="ko">
      <body className="min-h-screen bg-ivory font-sans text-text-primary antialiased">
        <TopPromoBanner banner={topBanner} />
        <SiteHeader consultCta={consultCta} />
        <main className="min-h-[calc(100vh-200px)] pb-20 md:pb-0">{children}</main>
        <SiteFooter />
        <MobileNav />
      </body>
    </html>
  );
}
