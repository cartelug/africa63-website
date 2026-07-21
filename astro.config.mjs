// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  site: 'https://theafrica63.com',
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [mdx(), sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', fr: 'fr' } } })],
  image: {
    // Sharp is the default service; keep AVIF/WebP generation on.
    responsiveStyles: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
