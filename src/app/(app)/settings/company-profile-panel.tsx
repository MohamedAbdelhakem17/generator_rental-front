'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/shared/error-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { apiClient, ApiError } from '@/lib/apiClient';
import type { FeatureItem } from '@/lib/company-profile-features';
import { useLocale } from '@/lib/i18n/locale-provider';
import type { SocialLink } from '@/lib/social-links';
import { CompanyProfileFeaturesEditor } from './company-profile-features-editor';
import { CompanyProfileImageField } from './company-profile-image-field';
import { CompanyProfilePhonesEditor } from './company-profile-phones-editor';
import { CompanyProfileSocialLinksEditor } from './company-profile-social-links-editor';

interface CompanyProfileResponse {
  companyName: string;
  address: string;
  phones: string[];
  socialLinks: SocialLink[];
  features: FeatureItem[];
  footerText: string;
  bannerImageUrl: string | null;
}

const COMPANY_PROFILE_QUERY_KEY = ['company-profile'];

export function CompanyProfilePanel({ canEdit }: { canEdit: boolean }) {
  const { t } = useLocale();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: COMPANY_PROFILE_QUERY_KEY,
    queryFn: ({ signal }) => apiClient.get<CompanyProfileResponse>('/api/company-profile', undefined, signal),
  });

  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [phones, setPhones] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [footerText, setFooterText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!data) return;
    setCompanyName(data.companyName);
    setAddress(data.address);
    setPhones(data.phones);
    setSocialLinks(data.socialLinks);
    setFeatures(data.features);
    setFooterText(data.footerText);
  }, [data]);

  async function save() {
    setIsSaving(true);
    try {
      await apiClient.put('/api/company-profile', {
        companyName,
        address,
        phones: phones.map((phone) => phone.trim()).filter((phone) => phone.length > 0),
        socialLinks: socialLinks.filter((link) => link.url.trim().length > 0),
        features: features.filter((feature) => feature.title.trim().length > 0),
        footerText,
      });
      toast.success(t('companyProfile.saveSuccessToast'));
      await refetch();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : t('companyProfile.saveFailedToast'));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState title={t('companyProfile.loadFailedTitle')} onRetry={refetch} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{t('companyProfile.pageDescription')}</p>
        <Button asChild variant="outline" size="sm">
          <a href="/company-profile" target="_blank" rel="noreferrer">
            {t('companyProfile.viewPublicPage')}
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </Button>
      </div>

      <CompanyProfileImageField
        bannerImageUrl={data.bannerImageUrl}
        canEdit={canEdit}
        onUploaded={() => void refetch()}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company-profile-name">{t('companyProfile.companyNameLabel')}</Label>
          <Input
            id="company-profile-name"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            disabled={!canEdit || isSaving}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company-profile-address">{t('companyProfile.addressLabel')}</Label>
          <Input
            id="company-profile-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            disabled={!canEdit || isSaving}
            placeholder={t('companyProfile.addressPlaceholder')}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{t('companyProfile.phonesLabel')}</Label>
        <CompanyProfilePhonesEditor phones={phones} canEdit={canEdit && !isSaving} onChange={setPhones} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{t('companyProfile.socialLinksLabel')}</Label>
        <CompanyProfileSocialLinksEditor links={socialLinks} canEdit={canEdit && !isSaving} onChange={setSocialLinks} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{t('companyProfile.featuresLabel')}</Label>
        <CompanyProfileFeaturesEditor features={features} canEdit={canEdit && !isSaving} onChange={setFeatures} />
        <span className="text-xs text-muted-foreground">{t('companyProfile.featuresHint')}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-profile-footer">{t('companyProfile.footerTextLabel')}</Label>
        <Textarea
          id="company-profile-footer"
          value={footerText}
          onChange={(event) => setFooterText(event.target.value)}
          disabled={!canEdit || isSaving}
          placeholder={t('companyProfile.footerTextPlaceholder')}
          rows={3}
        />
        <span className="text-xs text-muted-foreground">{t('companyProfile.footerTextHint')}</span>
      </div>

      {canEdit ? (
        <Button className="self-start" onClick={() => void save()} disabled={isSaving}>
          {t('companyProfile.save')}
        </Button>
      ) : null}
    </div>
  );
}
