// Central image registry — imports all optimizable images so content
// collections and components can reference them by string key.
import type { ImageMetadata } from 'astro';

import africa1 from '../assets/images/africa1.jpg';
import africa2 from '../assets/images/africa2.jpg';
import africa3 from '../assets/images/africa3.jpg';
import africa4 from '../assets/images/africa4.jpg';
import heroBoardroom from '../assets/images/generated/hero-boardroom-bg.jpg';
import heroCutoutExec from '../assets/images/generated/hero-cutout-exec.webp';
import headshot01 from '../assets/images/generated/headshot-team-01.webp';
import headshot02 from '../assets/images/generated/headshot-team-02-bg.jpg';
import handshake from '../assets/images/generated/handshake-cutout.webp';
import engagementScene from '../assets/images/generated/engagement-scene-bg.jpg';
import textureGlow from '../assets/images/generated/texture-glow-bg.jpg';
import textureWarm from '../assets/images/generated/texture-warm-bg.jpg';
import textureLinework from '../assets/images/generated/texture-linework.jpg';

// Fally Ipupa — Kampala press conference event photography
import fallyHero from '../assets/images/events/fally-hero.jpg';
import fallyOverview from '../assets/images/events/fally-overview.jpg';
import fally01 from '../assets/images/events/fally-01.jpg';
import fally02 from '../assets/images/events/fally-02.jpg';
import fally04 from '../assets/images/events/fally-04.jpg';
import fallyAudience from '../assets/images/events/fally-audience.jpg';
import fally07 from '../assets/images/events/fally-07.jpg';
import fally08 from '../assets/images/events/fally-08.jpg';
import fallyMedia from '../assets/images/events/fally-media.jpg';

// Leadership portraits — real A63 team + external engagement figures
import nathanMubembe from '../assets/images/team/nathan-mubembe.png';
import mubembeTwaibu from '../assets/images/team/mubembe-twaibu.png';
import neezaAmani from '../assets/images/team/neeza-amani.png';
import alysonKing from '../assets/images/team/alyson-king.png';
import augustinKabuya from '../assets/images/team/augustin-kabuya.png';

export const images: Record<string, ImageMetadata> = {
  africa1, africa2, africa3, africa4,
  'hero-boardroom': heroBoardroom,
  'hero-cutout-exec': heroCutoutExec,
  'headshot-01': headshot01,
  'headshot-02': headshot02,
  handshake,
  'engagement-scene': engagementScene,
  'texture-glow': textureGlow,
  'texture-warm': textureWarm,
  'texture-linework': textureLinework,
  'fally-hero': fallyHero,
  'fally-overview': fallyOverview,
  'fally-01': fally01,
  'fally-02': fally02,
  'fally-04': fally04,
  'fally-audience': fallyAudience,
  'fally-07': fally07,
  'fally-08': fally08,
  'fally-media': fallyMedia,
  'nathan-mubembe': nathanMubembe,
  'mubembe-twaibu': mubembeTwaibu,
  'neeza-amani': neezaAmani,
  'alyson-king': alysonKing,
  'augustin-kabuya': augustinKabuya,
};

export function img(key: string): ImageMetadata {
  return images[key] ?? africa1;
}

// Service icon PNG paths (served static from /public) — base-aware, used as <img>.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const serviceIcon = (icon: string) =>
  `${BASE}/assets/images/generated/icon-${icon}.png`;
