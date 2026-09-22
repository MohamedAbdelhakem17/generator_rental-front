'use client';

import { useRef, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { apiClient, ApiError } from '@/lib/apiClient';
import { useLocale } from '@/lib/i18n/locale-provider';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export function CompanyProfileImageField({
  bannerImageUrl,
  canEdit,
  onUploaded,
}: {
  bannerImageUrl: string | null;
  canEdit: boolean;
  onUploaded: () => void;
}) {
  const { t } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cacheBust, setCacheBust] = useState(0);

  async function uploadFile(file: File) {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await apiClient.uploadFormData('/api/company-profile/image', formData);
      toast.success(t('companyProfile.uploadSuccessToast'));
      setCacheBust((value) => value + 1);
      onUploaded();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : t('companyProfile.uploadFailedToast'));
    } finally {
      setIsUploading(false);
    }
  }

  const previewSrc = bannerImageUrl ? `${API_BASE_URL}${bannerImageUrl}?v=${cacheBust}` : null;

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-sm font-medium text-foreground">{t('companyProfile.bannerImageLabel')}</span>

      <div className="flex items-center gap-4">
        {/* Wide, short preview — a hint that this renders as a banner strip, not a full-page background. */}
        <div className="flex h-16 w-48 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="size-6 text-muted-foreground" aria-hidden />
          )}
        </div>

        {canEdit ? (
          <div className="flex flex-col gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading
                ? t('companyProfile.uploadingToast')
                : bannerImageUrl
                  ? t('companyProfile.replaceImage')
                  : t('companyProfile.uploadImage')}
            </Button>
            <span className="text-xs text-muted-foreground">{t('companyProfile.bannerImageHint')}</span>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              disabled={isUploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (file) void uploadFile(file);
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
