// ════════════════════════════════════════════════════════════
// i18n — UI string catalog + locale helpers
// ════════════════════════════════════════════════════════════
export const languages = { en: 'English', fr: 'Français' } as const;
export const defaultLang = 'en';
export type Lang = keyof typeof languages;

export const ui = {
  en: {
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.work': 'Work',
    'nav.insights': 'Insights',
    'nav.team': 'Team',
    'nav.contact': 'Contact',
    'nav.cta': 'Begin a Conversation',
    'nav.home': 'Home',
    'tag.public': 'Public Affairs',
    'tag.strategic': 'Strategic Advisory',
    'loader.note': 'The Africa We Want — Built on Trust',
    'footer.tagline.pre': 'The',
    'footer.tagline.em': 'Africa',
    'footer.tagline.post': 'We Want — Built on Trust.',
    'footer.navigate': 'Navigate',
    'footer.capabilities': 'Capabilities',
    'footer.contact': 'Contact',
    'footer.office': 'Kinshasa · DR Congo',
    'footer.rights': 'All rights reserved.',
    'footer.designed': 'Designed by NS Creative · Uganda',
    'cta.explore': 'Explore Services',
    'cta.work': 'See Our Work',
    'common.readStory': 'Read our story',
    'common.allServices': 'All Services',
    'common.viewAll': 'View All Engagements',
    'common.allInsights': 'All Insights',
    'common.backToTop': 'Back to top',
    'common.response': 'Within two business days',
  },
  fr: {
    'nav.about': 'À propos',
    'nav.services': 'Services',
    'nav.work': 'Réalisations',
    'nav.insights': 'Analyses',
    'nav.team': 'Équipe',
    'nav.contact': 'Contact',
    'nav.cta': 'Entamer un échange',
    'nav.home': 'Accueil',
    'tag.public': 'Affaires publiques',
    'tag.strategic': 'Conseil stratégique',
    'loader.note': "L'Afrique que nous voulons — Bâtie sur la confiance",
    'footer.tagline.pre': "L'",
    'footer.tagline.em': 'Afrique',
    'footer.tagline.post': 'que nous voulons — bâtie sur la confiance.',
    'footer.navigate': 'Navigation',
    'footer.capabilities': 'Compétences',
    'footer.contact': 'Contact',
    'footer.office': 'Kinshasa · RD Congo',
    'footer.rights': 'Tous droits réservés.',
    'footer.designed': 'Conçu par NS Creative · Ouganda',
    'cta.explore': 'Découvrir nos services',
    'cta.work': 'Voir nos réalisations',
    'common.readStory': 'Lire notre histoire',
    'common.allServices': 'Tous les services',
    'common.viewAll': 'Voir toutes les réalisations',
    'common.allInsights': 'Toutes les analyses',
    'common.backToTop': 'Haut de page',
    'common.response': 'Sous deux jours ouvrés',
  },
} as const;

export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg === 'fr') return 'fr';
  return 'en';
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)['en']): string {
    return (ui[lang] as Record<string, string>)[key] ?? (ui.en as Record<string, string>)[key];
  };
}

// Deploy base (e.g. "/africa63-website"); "" when served from root.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Locale- and base-aware path: en → "{base}/about", fr → "{base}/fr/about". */
export function localizePath(path: string, lang: Lang): string {
  const clean = path === '/' ? '' : path.replace(/^\/+/, '/');
  const locale = lang === 'en' ? '' : '/fr';
  const full = `${locale}${clean}`;
  return `${BASE}${full === '' ? '/' : full}`;
}

/** Base-aware static asset path, e.g. asset("/assets/logo/x.png"). */
export function asset(p: string): string {
  return `${BASE}${p.startsWith('/') ? p : `/${p}`}`;
}
