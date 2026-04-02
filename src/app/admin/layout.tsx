import { AdminAnalyticsOptOut } from "@/components/admin/AdminAnalyticsOptOut";
import { AdminAnalyticsPreference } from "@/components/admin/AdminAnalyticsPreference";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-ivory">
      <AdminAnalyticsOptOut />
      <AdminAnalyticsPreference />
      {children}
    </div>
  );
}
