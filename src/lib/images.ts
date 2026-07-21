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
};

export function img(key: string): ImageMetadata {
  return images[key] ?? africa1;
}

// Service icon PNG paths (served static from /public via source copy) — used as <img>.
export const serviceIcon = (icon: string) => `/assets/images/generated/icon-${icon}.png`;
