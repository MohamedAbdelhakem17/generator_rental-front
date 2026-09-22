'use client';

import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FEATURE_ICONS, FEATURE_ICON_META, type FeatureItem } from '@/lib/company-profile-features';
import { useLocale } from '@/lib/i18n/locale-provider';

/** The "why choose us" trust-badge row (see the screenshot: quality / maintenance / cost
 * savings / power solutions, each an icon + short title) — an admin-editable list, same
 * add/remove pattern as the phones and social-links editors. */
export function CompanyProfileFeaturesEditor({
  features,
  canEdit,
  onChange,
}: {
  features: FeatureItem[];
  canEdit: boolean;
  onChange: (features: FeatureItem[]) => void;
}) {
  const { t } = useLocale();

  function updateFeature(index: number, patch: Partial<FeatureItem>) {
    onChange(features.map((feature, i) => (i === index ? { ...feature, ...patch } : feature)));
  }

  function removeFeature(index: number) {
    onChange(features.filter((_, i) => i !== index));
  }

  function addFeature() {
    onChange([...features, { icon: 'quality', title: '' }]);
  }

  return (
    <div className="flex flex-col gap-2.5">
      {features.map((feature, index) => {
        const Icon = FEATURE_ICON_META[feature.icon].icon;
        return (
          <div key={index} className="flex items-center gap-2">
            <Select
              value={feature.icon}
              onValueChange={(icon) => updateFeature(index, { icon: icon as FeatureItem['icon'] })}
              disabled={!canEdit}
            >
              <SelectTrigger className="w-40 shrink-0">
                <span className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent>
                {FEATURE_ICONS.map((icon) => (
                  <SelectItem key={icon} value={icon}>
                    {t(FEATURE_ICON_META[icon].labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={feature.title}
              onChange={(event) => updateFeature(index, { title: event.target.value })}
              placeholder={t('companyProfile.featureTitlePlaceholder')}
              disabled={!canEdit}
              className="flex-1"
            />

            {canEdit ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t('companyProfile.removeFeature')}
                onClick={() => removeFeature(index)}
              >
                <X className="size-4" aria-hidden />
              </Button>
            ) : null}
          </div>
        );
      })}

      {canEdit ? (
        <Button type="button" variant="outline" size="sm" className="self-start" onClick={addFeature}>
          <Plus className="size-3.5" aria-hidden />
          {t('companyProfile.addFeature')}
        </Button>
      ) : null}
    </div>
  );
}
