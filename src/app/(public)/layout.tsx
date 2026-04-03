import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopPromoBanner } from "@/components/layout/TopPromoBanner";
import { getActiveBanners, getPrimaryConsultCta } from "@/lib/data/content";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const topBanner = (await getActiveBanners())[0];
  const consultCta = await getPrimaryConsultCta();

  return (
    <>
      <TopPromoBanner banner={topBanner} />
      <SiteHeader consultCta={consultCta} />
      <main className="min-h-[calc(100vh-200px)]">{children}</main>
      <SiteFooter consultCta={consultCta} />
    </>
  );
}
