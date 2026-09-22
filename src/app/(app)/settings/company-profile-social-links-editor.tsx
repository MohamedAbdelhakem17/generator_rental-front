'use client';

import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocale } from '@/lib/i18n/locale-provider';
import { SOCIAL_LINK_PLATFORMS, SOCIAL_PLATFORM_META, type SocialLink } from '@/lib/social-links';

export function CompanyProfileSocialLinksEditor({
  links,
  canEdit,
  onChange,
}: {
  links: SocialLink[];
  canEdit: boolean;
  onChange: (links: SocialLink[]) => void;
}) {
  const { t } = useLocale();

  function updateLink(index: number, patch: Partial<SocialLink>) {
    onChange(links.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  }

  function removeLink(index: number) {
    onChange(links.filter((_, i) => i !== index));
  }

  function addLink() {
    onChange([...links, { platform: 'website', url: '' }]);
  }

  return (
    <div className="flex flex-col gap-2.5">
      {links.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select
            value={link.platform}
            onValueChange={(platform) => updateLink(index, { platform: platform as SocialLink['platform'] })}
            disabled={!canEdit}
          >
            <SelectTrigger className="w-40 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SOCIAL_LINK_PLATFORMS.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {t(SOCIAL_PLATFORM_META[platform].labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={link.url}
            onChange={(event) => updateLink(index, { url: event.target.value })}
            placeholder={t('companyProfile.urlPlaceholder')}
            disabled={!canEdit}
            className="flex-1"
          />

          {canEdit ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t('companyProfile.removeLink')}
              onClick={() => removeLink(index)}
            >
              <X className="size-4" aria-hidden />
            </Button>
          ) : null}
        </div>
      ))}

      {canEdit ? (
        <Button type="button" variant="outline" size="sm" className="self-start" onClick={addLink}>
          <Plus className="size-3.5" aria-hidden />
          {t('companyProfile.addLink')}
        </Button>
      ) : null}
    </div>
  );
}
