"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone } from "lucide-react";

import { apiClient } from "@/lib/apiClient";
import {
  FEATURE_ICON_META,
  type FeatureItem,
} from "@/lib/company-profile-features";
import { useLocale } from "@/lib/i18n/locale-provider";
import {
  hrefForSocialLink,
  SOCIAL_PLATFORM_META,
  type SocialLink,
} from "@/lib/social-links";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const ACCENT = "#f0a52e";
const CARD_BG = "#111c2b";
const FEATURES_BG = "#0d1826";
const PAGE_BG = "#060b12";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0a52e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111c2b]";

interface CompanyProfileResponse {
  companyName: string;
  address: string;
  phones: string[];
  socialLinks: SocialLink[];
  features: FeatureItem[];
  footerText: string;
  /** A small banner-strip image at the top of the page — not a full-page background. */
  bannerImageUrl: string | null;
}

/** True public, unauthenticated page (Section: link-tree style company profile) — deliberately
 * outside the (app)/(print) route groups so it renders with no session guard and no app chrome. */
export default function CompanyProfilePage() {
  const { t } = useLocale();

  const { data, isLoading } = useQuery({
    queryKey: ["company-profile", "public"],
    queryFn: ({ signal }) =>
      apiClient.get<CompanyProfileResponse>(
        "/api/company-profile",
        undefined,
        signal,
      ),
    retry: 1,
  });

  const bannerImageSrc = data?.bannerImageUrl
    ? `${API_BASE_URL}${data.bannerImageUrl}`
    : null;
  const hasAnyContent = Boolean(
    data &&
    (data.companyName ||
      data.address ||
      data.phones.length > 0 ||
      data.socialLinks.length > 0),
  );

  return (
    <main
      className="flex min-h-dvh w-full items-center justify-center sm:px-4 sm:py-10"
      style={{ backgroundColor: PAGE_BG }}
      dir="auto"
    >
      <div
        className="flex w-full max-w-2xl flex-col overflow-hidden sm:rounded-3xl sm:shadow-2xl sm:shadow-black/50 sm:ring-1 sm:ring-white/5"
        style={{ backgroundColor: CARD_BG }}
      >
        {/* Banner strip — a bounded-height section, never the page background. */}
        {bannerImageSrc ? (
          <div className="relative h-92 w-full shrink-0 overflow-hidden sm-h-48">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerImageSrc}
              alt=""
              className="h-full w-full object-fit"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${CARD_BG}, transparent 55%)`,
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1"
              style={{ backgroundColor: ACCENT }}
            />
          </div>
        ) : null}

        <div className="flex animate-in flex-col items-center gap-6 px-6 py-9 text-center fade-in slide-in-from-bottom-2 duration-500">
          {isLoading ? (
            <div className="flex w-full flex-col items-center gap-4">
              <div className="h-7 w-48 animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-32 animate-pulse rounded-full bg-white/5" />
              <div className="h-9 w-40 animate-pulse rounded-full bg-white/5" />
            </div>
          ) : !hasAnyContent ? (
            <div className="flex flex-col items-center gap-2 text-white">
              <h1 className="text-xl font-semibold">
                {t("companyProfilePublic.noDataTitle")}
              </h1>
              <p className="text-sm text-white/60">
                {t("companyProfilePublic.noDataBody")}
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-3">
                {data?.companyName ? (
                  <h1 className="text-[1.65rem] font-bold leading-tight tracking-tight text-white">
                    {data.companyName}
                  </h1>
                ) : null}
                <span
                  className="h-0.5 w-10 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                  aria-hidden
                />
                {data?.address ? (
                  <p className="inline-flex items-center gap-1.5 text-sm text-white/60">
                    <MapPin className="size-3.5 shrink-0" aria-hidden />
                    {data.address}
                  </p>
                ) : null}
                {data && data.phones.length > 0 ? (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {data.phones.map((phoneNumber, index) => (
                      <a
                        key={index}
                        href={`tel:${phoneNumber.replace(/[^\d+]/g, "")}`}
                        dir="ltr"
                        className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10 ${FOCUS_RING}`}
                      >
                        <Phone
                          className="size-3.5"
                          style={{ color: ACCENT }}
                          aria-hidden
                        />
                        {phoneNumber}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>

              {data && data.socialLinks.length > 0 ? (
                <ul className="flex w-full flex-col gap-3 pt-1">
                  {data.socialLinks.map((link, index) => {
                    const meta = SOCIAL_PLATFORM_META[link.platform];
                    const Icon = meta.icon;
                    return (
                      <li key={index}>
                        <a
                          href={hrefForSocialLink(link)}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex w-full items-center gap-3 rounded-full bg-white/95 px-4 py-3 text-sm font-semibold text-[#1b2126] shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-black/30 active:translate-y-0 ${FOCUS_RING}`}
                        >
                          <span
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                            style={{ backgroundColor: meta.color }}
                            aria-hidden
                          >
                            {Icon ? <Icon className="size-4" /> : meta.initials}
                          </span>
                          <span className="flex-1 text-start truncate">
                            {link.label?.trim() || t(meta.labelKey)}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </>
          )}
        </div>

        {data && data.features.length > 0 ? (
          <section
            className="animate-in border-t border-white/5 px-6 py-9 fade-in slide-in-from-bottom-2 duration-700"
            style={{ backgroundColor: FEATURES_BG }}
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4 sm:gap-x-3">
              {data.features.map((feature, index) => {
                const Icon = FEATURE_ICON_META[feature.icon].icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2.5 text-center"
                  >
                    <span
                      className="flex size-12 shrink-0 items-center justify-center rounded-full shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${ACCENT}, #c9780f)`,
                        boxShadow: `0 6px 16px -4px ${ACCENT}66`,
                      }}
                    >
                      <Icon className="size-5 text-[#0d1826]" aria-hidden />
                    </span>
                    <span className="text-[0.8rem] font-semibold leading-snug text-white/90">
                      {feature.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {data?.footerText ? (
          <footer className="border-t border-white/5 px-6 py-5 text-center">
            <p className="whitespace-pre-line text-xs leading-relaxed text-white/40">
              {data.footerText}
            </p>
          </footer>
        ) : null}
      </div>
    </main>
  );
}
