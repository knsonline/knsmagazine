"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { prepareBannerFile } from "@/lib/storage/banner-image-client";
import {
  BANNER_ACCEPT_ATTRIBUTE,
  BANNER_MAX_FILE_SIZE_BYTES,
  BANNER_TARGET_MAX_DIMENSION,
  extractBannerStoragePath,
  getBannerValidationError,
} from "@/lib/storage/banners";
import type { BannerItem } from "@/types/content";

interface BannerEditorFormProps {
  action: (formData: FormData) => void | Promise<void>;
  banner?: BannerItem;
  footerAction?: ReactNode;
}

function SubmitButton({ hasBanner, disabled }: { hasBanner: boolean; disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 text-sm font-semibold text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "저장 중..." : hasBanner ? "배너 저장" : "배너 등록"}
    </button>
  );
}

export function BannerEditorForm({ action, banner, footerAction }: BannerEditorFormProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  return (
    <form action={action} className="card-surface space-y-5 p-5">
      <ImageUploader
        initialUrl={banner?.imageUrlRaw}
        onUploadingChange={setIsUploadingImage}
        uploadEndpoint="/api/admin/uploads/banners"
        fileInputId={banner ? `banner_file_${banner.id}` : "banner_file_new"}
        assetName="배너 이미지"
        acceptAttribute={BANNER_ACCEPT_ATTRIBUTE}
        acceptDisplayLabel="JPG, PNG, WEBP"
        maxFileSizeBytes={BANNER_MAX_FILE_SIZE_BYTES}
        targetMaxDimension={BANNER_TARGET_MAX_DIMENSION}
        previewAspectClassName="aspect-[16/7]"
        emptyPreviewMessage="업로드한 배너가 여기에서 미리 보여요."
        replaceHintMessage="새 파일을 업로드한 뒤 저장하면 기존 배너 이미지가 자동으로 교체됩니다."
        fieldNames={{
          url: "image_url",
          storagePath: "banner_storage_path",
          previousStoragePath: "previous_banner_storage_path",
        }}
        extractStoragePath={extractBannerStoragePath}
        validateFile={getBannerValidationError}
        prepareFile={prepareBannerFile}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-2 xl:col-span-3">
          <label
            className="text-sm font-semibold text-text-primary"
            htmlFor={banner ? `link_url_${banner.id}` : "link_url_new"}
          >
            링크 URL
          </label>
          <input
            id={banner ? `link_url_${banner.id}` : "link_url_new"}
            name="link_url"
            type="url"
            defaultValue={banner?.linkUrl === "#" ? "" : banner?.linkUrl}
            placeholder="https://example.com"
            className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-text-primary"
            htmlFor={banner ? `starts_at_${banner.id}` : "starts_at_new"}
          >
            노출 시작일
          </label>
          <input
            id={banner ? `starts_at_${banner.id}` : "starts_at_new"}
            name="starts_at"
            type="date"
            defaultValue={banner?.startsAt ?? ""}
            className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-text-primary"
            htmlFor={banner ? `ends_at_${banner.id}` : "ends_at_new"}
          >
            노출 종료일
          </label>
          <input
            id={banner ? `ends_at_${banner.id}` : "ends_at_new"}
            name="ends_at"
            type="date"
            defaultValue={banner?.endsAt ?? ""}
            className="min-h-12 w-full rounded-2xl border border-black/10 bg-ivory px-4 outline-none"
          />
        </div>

        <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-ivory px-4 text-sm font-semibold text-text-primary">
          <input name="is_active" type="checkbox" defaultChecked={banner?.isActive ?? true} />
          활성
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton hasBanner={Boolean(banner)} disabled={isUploadingImage} />
        {footerAction}
        {isUploadingImage ? (
          <p className="text-sm text-warning">배너 업로드가 끝난 뒤 저장할 수 있어요.</p>
        ) : null}
      </div>
    </form>
  );
}
