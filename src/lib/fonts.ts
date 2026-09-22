import { El_Messiri, IBM_Plex_Mono } from 'next/font/google';

/** System-wide UI font — covers both Arabic and Latin in a single family, so it applies to
 * both text directions without a separate `[dir='rtl']` font-family override. */
export const elMessiri = El_Messiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-el-messiri',
  display: 'swap',
});

/** Kept for tabular numeric alignment (`.tabular-data`, e.g. financial figures in tables) —
 * El Messiri isn't monospaced, so digit columns wouldn't line up if it replaced this too. */
export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});
