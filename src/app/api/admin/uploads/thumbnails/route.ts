import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  THUMBNAIL_BUCKET,
  buildThumbnailStoragePath,
  getThumbnailValidationError,
} from "@/lib/storage/thumbnails";
import type { StorageImageUploadResult } from "@/lib/storage/images";

async function requireAuthenticatedAdminForApi() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function POST(request: Request) {
  const user = await requireAuthenticatedAdminForApi();

  if (!user) {
    return NextResponse.json({ error: "관리자 로그인 후 다시 시도해 주세요." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "업로드할 이미지 파일을 찾지 못했어요." }, { status: 400 });
  }

  const validationError = getThumbnailValidationError(file);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const storagePath = buildThumbnailStoragePath(file.type);
  const { error: uploadError } = await supabase.storage.from(THUMBNAIL_BUCKET).upload(storagePath, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    return NextResponse.json({ error: "썸네일 업로드에 실패했어요. 잠시 후 다시 시도해 주세요." }, { status: 500 });
  }

  const { data } = supabase.storage.from(THUMBNAIL_BUCKET).getPublicUrl(storagePath);
  const payload: StorageImageUploadResult = {
    path: storagePath,
    publicUrl: data.publicUrl,
  };

  return NextResponse.json(payload);
}

export async function DELETE(request: Request) {
  const user = await requireAuthenticatedAdminForApi();

  if (!user) {
    return NextResponse.json({ error: "관리자 로그인 후 다시 시도해 주세요." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { path?: string } | null;
  const path = body?.path?.trim();

  if (!path) {
    return NextResponse.json({ error: "삭제할 썸네일 경로가 필요해요." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage.from(THUMBNAIL_BUCKET).remove([path]);

  if (error) {
    return NextResponse.json({ error: "이전 썸네일 정리에 실패했어요." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
