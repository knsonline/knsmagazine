"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { BANNER_BUCKET, extractBannerStoragePath } from "@/lib/storage/banners";
import { PRIMARY_GRADES, TOPICS } from "@/constants/taxonomy";
import { THUMBNAIL_BUCKET } from "@/lib/storage/thumbnails";
import { getIdSlugPrefix } from "@/lib/utils/slug";
import { toNullableMultilineText } from "@/lib/utils/text";

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

function parseText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function parseMultilineText(value: FormDataEntryValue | null) {
  return toNullableMultilineText(typeof value === "string" ? value : "");
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
  PRIMARY_GRADES.forEach((grade) => revalidatePath(`/grades/${grade}`));
  TOPICS.forEach((topic) => revalidatePath(`/search?topic=${encodeURIComponent(topic)}`));
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
  revalidatePath("/admin");
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
    await removeThumbnailIfExists(previousThumbnailPath);
  }

  revalidateMagazine();
  revalidateContentRoutes(id);
  revalidatePath("/admin");
  revalidateAdminContentRoutes(id);
  redirect(`/admin/contents/${id}/edit`);
}

export async function deleteContentAction(id: string) {
  await requireAdminUser();

  if (!hasSupabaseEnv()) {
    redirect("/admin/contents");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("contents").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateMagazine();
  revalidateContentRoutes(id);
  revalidatePath("/admin");
  revalidateAdminContentRoutes(id);
  redirect("/admin/contents");
}

export async function createCtaAction(formData: FormData) {
  await requireAdminUser();
  if (!hasSupabaseEnv()) redirect("/admin/ctas");

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("ctas").insert({
    label: parseText(formData.get("label")),
    url: parseText(formData.get("url")),
  });

  if (error) throw new Error(error.message);

  revalidateMagazine();
  revalidatePath("/admin/ctas");
  revalidatePath("/admin/contents");
  redirect("/admin/ctas");
}

export async function updateCtaAction(id: string, formData: FormData) {
  await requireAdminUser();
  if (!hasSupabaseEnv()) redirect("/admin/ctas");

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("ctas")
    .update({
      label: parseText(formData.get("label")),
      url: parseText(formData.get("url")),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidateMagazine();
  revalidatePath("/admin/ctas");
  revalidatePath("/admin/contents");
  redirect("/admin/ctas");
}

export async function deleteCtaAction(id: string) {
  await requireAdminUser();
  if (!hasSupabaseEnv()) redirect("/admin/ctas");

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("ctas").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidateMagazine();
  revalidatePath("/admin");
  revalidatePath("/admin/ctas");
  revalidatePath("/admin/contents");
  redirect("/admin/ctas");
}

export async function createBannerAction(formData: FormData) {
  await requireAdminUser();
  if (!hasSupabaseEnv()) redirect("/admin/banners");

  const supabase = createSupabaseAdminClient();
  const nextBannerPath = parseText(formData.get("banner_storage_path")) || null;
  const payload = {
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
  revalidatePath("/admin");
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
  revalidatePath("/admin");
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
  revalidatePath("/admin");
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

    if (itemsError) throw new Error(itemsError.message);
  }

  revalidateMagazine();
  revalidateCollectionRoutes(data.id);
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

  const contentIds = formData.getAll("content_ids").map((value) => String(value));
  await supabase.from("collection_items").delete().eq("collection_id", id);

  if (contentIds.length > 0) {
    const { error: itemsError } = await supabase.from("collection_items").insert(
      contentIds.map((contentId, index) => ({
        collection_id: id,
        content_id: contentId,
        sort_order: index,
      })),
    );

    if (itemsError) throw new Error(itemsError.message);
  }

  revalidateMagazine();
  revalidateCollectionRoutes(id);
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
  revalidatePath("/admin");
  revalidatePath("/admin/collections");
  redirect("/admin/collections");
}
