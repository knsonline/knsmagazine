import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdminUser } from "@/lib/auth/admin";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdminUser();

  return (
    <div className="min-h-screen bg-ivory lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <div className="border-b border-black/6 bg-white px-5 py-4 lg:px-8">
          <p className="text-lg font-semibold tracking-[-0.02em] text-text-primary">운영자 대시보드</p>
        </div>
        <div className="px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
