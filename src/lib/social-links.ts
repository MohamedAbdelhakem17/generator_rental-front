import { Globe, Link2, Mail, MessageCircle, Music2, type LucideIcon } from 'lucide-react';
import type { TranslationKey } from '@/lib/i18n/dictionary';

/** Mirrors backend/src/modules/company-profile/companyProfile.model.ts's SOCIAL_LINK_PLATFORMS
 * — kept in sync by hand since the frontend has no build-time access to the backend package. */
export const SOCIAL_LINK_PLATFORMS = [
  'facebook',
  'instagram',
  'twitter',
  'linkedin',
  'youtube',
  'tiktok',
  'whatsapp',
  'website',
  'email',
  'other',
] as const;
export type SocialLinkPlatform = (typeof SOCIAL_LINK_PLATFORMS)[number];

export interface SocialLink {
  platform: SocialLinkPlatform;
  url: string;
  label?: string;
}

interface PlatformMeta {
  labelKey: TranslationKey;
  /** lucide-react ships no brand marks (Facebook/Instagram/... were dropped upstream), so
   * brand platforms render as a colored initials badge instead — `icon` is only set for the
   * generic, non-branded platforms that do have a matching lucide icon. */
  icon: LucideIcon | null;
  initials: string;
  color: string;
}

export const SOCIAL_PLATFORM_META: Record<SocialLinkPlatform, PlatformMeta> = {
  facebook: { labelKey: 'companyProfile.platform.facebook', icon: null, initials: 'f', color: '#1877F2' },
  instagram: { labelKey: 'companyProfile.platform.instagram', icon: null, initials: 'IG', color: '#C13584' },
  twitter: { labelKey: 'companyProfile.platform.twitter', icon: null, initials: 'X', color: '#0F1419' },
  linkedin: { labelKey: 'companyProfile.platform.linkedin', icon: null, initials: 'in', color: '#0A66C2' },
  youtube: { labelKey: 'companyProfile.platform.youtube', icon: null, initials: '▶', color: '#FF0000' },
  tiktok: { labelKey: 'companyProfile.platform.tiktok', icon: Music2, initials: '', color: '#000000' },
  whatsapp: { labelKey: 'companyProfile.platform.whatsapp', icon: MessageCircle, initials: '', color: '#25D366' },
  website: { labelKey: 'companyProfile.platform.website', icon: Globe, initials: '', color: '#1e5f8c' },
  email: { labelKey: 'companyProfile.platform.email', icon: Mail, initials: '', color: '#5b6670' },
  other: { labelKey: 'companyProfile.platform.other', icon: Link2, initials: '', color: '#5b6670' },
};

/** Normalizes a stored link into something safe for an `<a href>` — `whatsapp`/`email` accept
 * a bare number/address in the admin form, not a full URL. */
export function hrefForSocialLink(link: SocialLink): string {
  if (link.platform === 'whatsapp') {
    const digits = link.url.replace(/[^\d+]/g, '');
    return `https://wa.me/${digits.replace(/^\+/, '')}`;
  }
  if (link.platform === 'email') {
    return link.url.includes('@') && !link.url.startsWith('mailto:') ? `mailto:${link.url}` : link.url;
  }
  if (/^https?:\/\//i.test(link.url) || link.url.startsWith('mailto:') || link.url.startsWith('tel:')) {
    return link.url;
  }
  return `https://${link.url}`;
}
