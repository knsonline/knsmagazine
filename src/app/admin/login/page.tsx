import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLoginPage() {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/admin");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      {hasSupabaseEnv() ? (
        <AdminLoginForm />
      ) : (
        <div className="w-full max-w-xl">
          <EmptyState
            title="Supabase 환경변수가 아직 설정되지 않았습니다."
            description=".env.local 에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY 를 넣어 주세요."
          />
        </div>
      )}
    </div>
  );
}
