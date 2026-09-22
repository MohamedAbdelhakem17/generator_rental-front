import { Headset, PiggyBank, ShieldCheck, Star, Truck, Wrench, Zap, type LucideIcon } from 'lucide-react';
import type { TranslationKey } from '@/lib/i18n/dictionary';

/** Mirrors backend/src/modules/company-profile/companyProfile.model.ts's FEATURE_ICONS —
 * kept in sync by hand since the frontend has no build-time access to the backend package. */
export const FEATURE_ICONS = ['quality', 'maintenance', 'value', 'power', 'support', 'delivery', 'other'] as const;
export type FeatureIconKey = (typeof FEATURE_ICONS)[number];

export interface FeatureItem {
  icon: FeatureIconKey;
  title: string;
}

interface FeatureIconMeta {
  labelKey: TranslationKey;
  icon: LucideIcon;
}

/** Default titles are just placeholders offered when adding a new feature in the admin
 * form — the actual card always renders the admin's own `title` text. */
export const FEATURE_ICON_META: Record<FeatureIconKey, FeatureIconMeta> = {
  quality: { labelKey: 'companyProfile.featureIcon.quality', icon: ShieldCheck },
  maintenance: { labelKey: 'companyProfile.featureIcon.maintenance', icon: Wrench },
  value: { labelKey: 'companyProfile.featureIcon.value', icon: PiggyBank },
  power: { labelKey: 'companyProfile.featureIcon.power', icon: Zap },
  support: { labelKey: 'companyProfile.featureIcon.support', icon: Headset },
  delivery: { labelKey: 'companyProfile.featureIcon.delivery', icon: Truck },
  other: { labelKey: 'companyProfile.featureIcon.other', icon: Star },
};
