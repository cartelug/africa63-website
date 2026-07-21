# Africa 63 — Website

Editorial-luxury redesign of the Africa 63 public-affairs site, built with **Astro** (static output), bilingual **EN/FR**, with a GSAP + Lenis motion layer.

## Stack
- **Astro 5** — static site generation, content collections, i18n routing, responsive image pipeline (AVIF/WebP)
- **Fraunces** (display serif) + **Montserrat** (body) — self-hosted variable fonts
- **GSAP + ScrollTrigger + Lenis + Splitting** — scroll choreography, kinetic type, smooth scroll (self-hosted, `prefers-reduced-motion` aware)

## Develop
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview
```

## Content
Bilingual content lives in `src/content/{services,caseStudies,insights,team}/{en,fr}/`.
Regenerate the seed set with `node scripts/seed-content.mjs`.
UI strings are in `src/i18n/ui.ts`; nav/config in `src/config/site.ts`.

## To finish before launch
- **Contact form:** set a real access key in `src/components/pages/ContactView.astro`
  (replace `YOUR_WEB3FORMS_ACCESS_KEY` — free key at web3forms.com), or swap for
  your host's form handler.
- **Team:** replace the placeholder entries in `src/content/team/**` with real names,
  roles, photos, and bios. The generated headshots are placeholders only.
- **Case studies / Insights:** two case studies and the insights are seeded drafts —
  finalise the copy and imagery.
- **Social links:** set real URLs in `src/config/site.ts`.
- **French copy:** professionally reviewed for the long-form pages.

## Deploy
`.github/workflows/deploy.yml` builds on every push to `main` and can publish to
GitHub Pages. For Netlify / Cloudflare Pages, set build command `npm run build`
and publish directory `dist/`.
