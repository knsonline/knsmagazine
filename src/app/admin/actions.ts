"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { BANNER_BUCKET, extractBannerStoragePath } from "@/lib/storage/banners";
import { extractThumbnailStoragePath, THUMBNAIL_BUCKET } from "@/lib/storage/thumbnails";
import { getIdSlugPrefix } from "@/lib/utils/slug";
import { toNullableMultilineText } from "@/lib/utils/text";
import type { ContentRow } from "@/types/database";

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

function parseText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function parseMultilineText(value: FormDataEntryValue | null) {
  return toNullableMultilineText(typeof value === "string" ? value : "");
}

function parseOptionalText(value: FormDataEntryValue | null) {
  const parsed = parseText(value);
  return parsed || null;
}

async function removeStorageObjectIfExists(bucket: string, path: string | null) {
  if (!path) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  await supabase.storage.from(bucket).remove([path]);
}

async function removeThumbnailIfExists(path: string | null) {
  await removeStorageObjectIfExists(THUMBNAIL_BUCKET, path);
}

async function removeBannerIfExists(path: string | null) {
  await removeStorageObjectIfExists(BANNER_BUCKET, path);
}

function revalidateMagazine() {
  revalidatePath("/");
  revalidatePath("/contents");
  revalidatePath("/search");
  revalidatePath("/grades/[grade]", "page");
}

function revalidateAdminIntelligence() {
  revalidatePath("/admin");
}

function revalidateContentRoutes(id: string) {
  revalidatePath(`/contents/${getIdSlugPrefix(id)}`);
}

function revalidateAdminContentRoutes(id: string) {
  revalidatePath("/admin/contents");
  revalidatePath(`/admin/contents/${id}/edit`);
  revalidatePath("/admin/contents/[id]/edit", "page");
}

function revalidateCollectionRoutes(id: string) {
  revalidatePath(`/collections/${getIdSlugPrefix(id)}`);
}

async function isThumbnailPathReferencedByOtherContents(path: string, excludeContentId?: string) {
  if (!path || !hasSupabaseEnv()) {
    return false;
  }

  const supabase = createSupabaseAdminClient();
  let query = supabase.from("contents").select("id,thumbnail_url").not("thumbnail_url", "is", null);

  if (excludeContentId) {
    query = query.neq("id", excludeContentId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as Pick<ContentRow, "id" | "thumbnail_url">[]).some(
    (row) => extractThumbnailStoragePath(row.thumbnail_url) === path,
  );
}

async function removeThumbnailIfUnused(path: string | null, excludeContentId?: string) {
  if (!path) {
    return;
  }

  const isReferenced = await isThumbnailPathReferencedByOtherContents(path, excludeContentId);

  if (!isReferenced) {
    await removeThumbnailIfExists(path);
  }
}

export async function logoutAction() {
  if (!hasSupabaseEnv()) {
    redirect("/admin/login");
  }

  const user = await requireAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createContentAction(formData: FormData) {
  await requireAdminUser();

  if (!hasSupabaseEnv()) {
    redirect("/admin/contents");
  }

  const supabase = createSupabaseAdminClient();
  const nextThumbnailPath = parseText(formData.get("thumbnail_storage_path")) || null;
  const payload = {
    title: parseText(formData.get("title")),
    summary: parseMultilineText(formData.get("summary")),
    body: parseMultilineText(formData.get("body")),
    external_url: parseText(formData.get("external_url")),
    thumbnail_url: parseText(formData.get("thumbnail_url")) || null,
    grade: parseText(formData.get("grade")),
    topic: parseText(formData.get("topic")),
    content_type: parseText(formData.get("content_type")),
    is_published: parseBoolean(formData.get("is_published")),
    is_featured: parseBoolean(formData.get("is_featured")),
    is_hero: parseBoolean(formData.get("is_hero")),
    cta_id: parseText(formData.get("cta_id")) || null,
  };

  let createdContentId: string;

  try {
    if (payload.is_hero) {
      const { error: heroError } = await supabase.from("contents").update({ is_hero: false }).eq("is_hero", true);

      if (heroError) {
        throw new Error(heroError.message);
      }
    }

    const { data, error } = await supabase.from("contents").insert(payload).select("id").single();

    if (error) {
      throw new Error(error.message);
    }

    createdContentId = data.id;
  } catch (error) {
    await removeThumbnailIfExists(nextThumbnailPath);
    throw error;
  }

  revalidateMagazine();
  revalidateContentRoutes(createdContentId);
  revalidateAdminIntelligence();
  revalidateAdminContentRoutes(createdContentId);
  redirect(`/admin/contents/${createdContentId}/edit`);
}

export async function updateContentAction(id: string, formData: FormData) {
  await requireAdminUser();

  if (!hasSupabaseEnv()) {
    redirect("/admin/contents");
  }

  const supabase = createSupabaseAdminClient();
  const previousThumbnailPath = parseText(formData.get("previous_thumbnail_storage_path")) || null;
  const nextThumbnailPath = parseText(formData.get("thumbnail_storage_path")) || null;
  const payload = {
    title: parseText(formData.get("title")),
    summary: parseMultilineText(formData.get("summary")),
    body: parseMultilineText(formData.get("body")),
    external_url: parseText(formData.get("external_url")),
    thumbnail_url: parseText(formData.get("thumbnail_url")) || null,
    grade: parseText(formData.get("grade")),
    topic: parseText(formData.get("topic")),
    content_type: parseText(formData.get("content_type")),
    is_published: parseBoolean(formData.get("is_published")),
    is_featured: parseBoolean(formData.get("is_featured")),
    is_hero: parseBoolean(formData.get("is_hero")),
    cta_id: parseText(formData.get("cta_id")) || null,
    updated_at: new Date().toISOString(),
  };

  try {
    if (payload.is_hero) {
      const { error: heroError } = await supabase.from("contents").update({ is_hero: false }).neq("id", id).eq("is_hero", true);

      if (heroError) {
        throw new Error(heroError.message);
      }
    }

    const { error } = await supabase.from("contents").update(payload).eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    if (nextThumbnailPath && nextThumbnailPath !== previousThumbnailPath) {
      await removeThumbnailIfExists(nextThumbnailPath);
    }

    throw error;
  }

  if (previousThumbnailPath && previousThumbnailPath !== nextThumbnailPath) {
    await removeThumbnailIfUnused(previousThumbnailPath, id);
  }

  revalidateMagazine();
  revalidateContentRoutes(id);
  revalidateAdminIntelligence();
  revalidateAdminContentRoutes(id);
  redirect(`/admin/contents/${id}/edit`);
}

export async function deleteContentAction(id: string) {
  await requireAdminUser();

  if (!hasSupabaseEnv()) {
    redirect("/admin/contents");
  }

  const supabase = createSupabaseAdminClient();
  const { data: contentRow, error: fetchError } = await supabase
    .from("contents")
    .select("thumbnail_url")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const { error } = await supabase.from("contents").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await removeThumbnailIfUnused(extractThumbnailStoragePath(contentRow?.thumbnail_url ?? null), id);

  revalidateMagazine();
  revalidateContentRoutes(id);
  revalidateAdminIntelligence();
  revalidateAdminContentRoutes(id);
  redirect("/admin/contents");
}

export async function duplicateContentAction(id: string) {
  await requireAdminUser();

  if (!hasSupabaseEnv()) {
    redirect("/admin/contents");
  }

  const supabase = createSupabaseAdminClient();
  const { data: sourceContent, error: sourceError } = await supabase.from("contents").select("*").eq("id", id).single();

  if (sourceError || !sourceContent) {
    throw new Error(sourceError?.message ?? "복제할 콘텐츠를 찾을 수 없습니다.");
  }

  const payload = {
    title: `[복사본] ${sourceContent.title}`,
    summary: sourceContent.summary,
    body: sourceContent.body,
    external_url: "",
    thumbnail_url: sourceContent.thumbnail_url,
    grade: sourceContent.grade,
    topic: sourceContent.topic,
    content_type: sourceContent.content_type,
    is_published: false,
    is_featured: false,
    is_hero: false,
    cta_id: sourceContent.cta_id,
  };

  const { data, error } = await supabase.from("contents").insert(payload).select("id").single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateMagazine();
  revalidateAdminIntelligence();
  revalidatePath("/admin/contents");
  revalidateAdminContentRoutes(data.id);
  redirect(`/admin/contents/${data.id}/edit?duplicated=1`);
}

export async function createCtaAction(formData: FormData) {
  await requireAdminUser();
  if (!hasSupabaseEnv()) redirect("/admin/ctas");

  const supabase = createSupabaseAdminClient();
  const kind = parseText(formData.get("kind")) === "consult" ? "consult" : "external";
  const payload = {
    label: parseText(formData.get("label")),
    url: parseText(formData.get("url")),
    kind,
    consult_segment: kind === "consult" ? parseOptionalText(formData.get("consult_segment")) : null,
  };

  const { error } = await supabase.from("ctas").insert(payload);

  if (error) throw new Error(error.message);

  revalidateMagazine();
  revalidateAdminIntelligence();
  redirect("/admin/ctas");
}

export async function updateCtaAction(id: string, formData: FormData) {
  await requireAdminUser();
  if (!hasSupabaseEnv()) redirect("/admin/ctas");

  const supabase = createSupabaseAdminClient();
  const kind = parseText(formData.get("kind")) === "consult" ? "consult" : "external";
  const payload = {
    label: parseText(formData.get("label")),
    url: parseText(formData.get("url")),
    kind,
    consult_segment: kind === "consult" ? parseOptionalText(formData.get("consult_segment")) : null,
  };

  const { error } = await supabase.from("ctas").update(payload).eq("id", id);

  if (error) throw new Error(error.message);

  revalidateMagazine();
  revalidateAdminIntelligence();
  redirect("/admin/ctas");
}

export async function deleteCtaAction(id: string) {
  await requireAdminUser();
  if (!hasSupabaseEnv()) redirect("/admin/ctas");

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("ctas").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidateMagazine();
  revalidateAdminIntelligence();
  revalidatePath("/admin/contents");
  redirect("/admin/ctas");
}

export async function createBannerAction(formData: FormData) {
  await requireAdminUser();
  if (!hasSupabaseEnv()) redirect("/admin/banners");

  const supabase = createSupabaseAdminClient();
  const nextBannerPath = parseText(formData.get("banner_storage_path")) || null;
  const payload = {
    title: parseText(formData.get("title")),
    image_url: parseText(formData.get("image_url")),
    link_url: parseText(formData.get("link_url")) || null,
    starts_at: parseText(formData.get("starts_at")) || null,
    ends_at: parseText(formData.get("ends_at")) || null,
    is_active: parseBoolean(formData.get("is_active")),
  };

  const { error } = await supabase.from("banners").insert(payload);

  if (error) {
    await removeBannerIfExists(nextBannerPath);
    throw new Error(error.message);
  }

  revalidateMagazine();
  revalidateAdminIntelligence();
  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function updateBannerAction(id: string, formData: FormData) {
  await requireAdminUser();
  if (!hasSupabaseEnv()) redirect("/admin/banners");

  const supabase = createSupabaseAdminClient();
  const previousBannerPath = parseText(formData.get("previous_banner_storage_path")) || null;
  const nextBannerPath = parseText(formData.get("banner_storage_path")) || null;
  const payload = {
    title: parseText(formData.get("title")),
    image_url: parseText(formData.get("image_url")),
    link_url: parseText(formData.get("link_url")) || null,
    starts_at: parseText(formData.get("starts_at")) || null,
    ends_at: parseText(formData.get("ends_at")) || null,
    is_active: parseBoolean(formData.get("is_active")),
  };

  const { error } = await supabase.from("banners").update(payload).eq("id", id);

  if (error) {
    if (nextBannerPath && nextBannerPath !== previousBannerPath) {
      await removeBannerIfExists(nextBannerPath);
    }

    throw new Error(error.message);
  }

  if (previousBannerPath && previousBannerPath !== nextBannerPath) {
    await removeBannerIfExists(previousBannerPath);
  }

  revalidateMagazine();
  revalidateAdminIntelligence();
  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function deleteBannerAction(id: string) {
  await requireAdminUser();
  if (!hasSupabaseEnv()) redirect("/admin/banners");

  const supabase = createSupabaseAdminClient();
  const { data: bannerRow, error: fetchError } = await supabase
    .from("banners")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const { error } = await supabase.from("banners").delete().eq("id", id);

  if (error) throw new Error(error.message);

  await removeBannerIfExists(extractBannerStoragePath(parseText(bannerRow?.image_url ?? null)));

  revalidateMagazine();
  revalidateAdminIntelligence();
  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function createCollectionAction(formData: FormData) {
  await requireAdminUser();
  if (!hasSupabaseEnv()) redirect("/admin/collections");

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("collections")
    .insert({
      name: parseText(formData.get("name")),
      is_visible_home: parseBoolean(formData.get("is_visible_home")),
      sort_order: Number(parseText(formData.get("sort_order")) || "0"),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  const contentIds = formData.getAll("content_ids").map((value) => String(value));

  if (contentIds.length > 0) {
    const { error: itemsError } = await supabase.from("collection_items").insert(
      contentIds.map((contentId, index) => ({
        collection_id: data.id,
        content_id: contentId,
        sort_order: index,
      })),
    );

    if (itemsError) {
      await supabase.from("collections").delete().eq("id", data.id);
      throw new Error(itemsError.message);
    }
  }

  revalidateMagazine();
  revalidateCollectionRoutes(data.id);
  revalidateAdminIntelligence();
  revalidatePath("/admin/collections");
  redirect("/admin/collections");
}

export async function updateCollectionAction(id: string, formData: FormData) {
  await requireAdminUser();
  if (!hasSupabaseEnv()) redirect("/admin/collections");

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("collections")
    .update({
      name: parseText(formData.get("name")),
      is_visible_home: parseBoolean(formData.get("is_visible_home")),
      sort_order: Number(parseText(formData.get("sort_order")) || "0"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  const contentIds = [...new Set(formData.getAll("content_ids").map((value) => String(value)))];
  const { data: existingItems, error: existingItemsError } = await supabase
    .from("collection_items")
    .select("content_id")
    .eq("collection_id", id);

  if (existingItemsError) throw new Error(existingItemsError.message);

  if (contentIds.length > 0) {
    const { error: itemsError } = await supabase.from("collection_items").upsert(
      contentIds.map((contentId, index) => ({
        collection_id: id,
        content_id: contentId,
        sort_order: index,
      })),
      {
        onConflict: "collection_id,content_id",
      },
    );

    if (itemsError) throw new Error(itemsError.message);
  }

  const removableContentIds = (existingItems ?? [])
    .map((item) => item.content_id)
    .filter((contentId) => !contentIds.includes(contentId));

  if (contentIds.length === 0) {
    const { error: deleteItemsError } = await supabase
      .from("collection_items")
      .delete()
      .eq("collection_id", id);

    if (deleteItemsError) throw new Error(deleteItemsError.message);
  } else if (removableContentIds.length > 0) {
    const { error: deleteItemsError } = await supabase
      .from("collection_items")
      .delete()
      .eq("collection_id", id)
      .in("content_id", removableContentIds);

    if (deleteItemsError) throw new Error(deleteItemsError.message);
  }

  revalidateMagazine();
  revalidateCollectionRoutes(id);
  revalidateAdminIntelligence();
  revalidatePath("/admin/collections");
  redirect("/admin/collections");
}

export async function deleteCollectionAction(id: string) {
  await requireAdminUser();
  if (!hasSupabaseEnv()) redirect("/admin/collections");

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("collections").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidateMagazine();
  revalidateCollectionRoutes(id);
  revalidateAdminIntelligence();
  revalidatePath("/admin/collections");
  redirect("/admin/collections");
}
