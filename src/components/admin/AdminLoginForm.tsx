"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="card-surface w-full max-w-md space-y-5 p-8"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");

        startTransition(async () => {
          const supabase = createSupabaseBrowserClient();
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

          if (signInError) {
            setError("이메일 또는 비밀번호를 다시 확인해 주세요.");
            return;
          }

          router.replace("/admin");
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-[-0.03em] text-text-primary">운영자 로그인</h1>
        <p className="text-sm leading-7 text-text-secondary">
          KNS 매거진 운영을 위한 단일 관리자 계정으로 로그인합니다.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-text-primary" htmlFor="email">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none focus:border-navy/30"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-text-primary" htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none focus:border-navy/30"
        />
      </div>

      {error ? <p className="text-sm font-medium text-error">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-cta-primary px-5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
