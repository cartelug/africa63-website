// Site-wide configuration — single source of truth for nav, socials, contact.
import type { Lang } from '../i18n/ui';

export const site = {
  name: 'Africa 63',
  domain: 'https://theafrica63.com',
  email: 'hello@theafrica63.com',
  locality: 'Kinshasa',
  country: 'CD',
  socials: [
    { label: 'LinkedIn', short: 'LI', href: 'https://www.linkedin.com/' },
    { label: 'Instagram', short: 'IG', href: 'https://www.instagram.com/' },
    { label: 'X / Twitter', short: 'X', href: 'https://x.com/' },
  ],
};

// Primary nav — keys resolve through the i18n catalog.
export const navItems: { key: string; path: string }[] = [
  { key: 'nav.about', path: '/about' },
  { key: 'nav.services', path: '/services' },
  { key: 'nav.work', path: '/work' },
  { key: 'nav.insights', path: '/insights' },
  { key: 'nav.team', path: '/team' },
  { key: 'nav.contact', path: '/contact' },
];

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'fr' : 'en';
}
