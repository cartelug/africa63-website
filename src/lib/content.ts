import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

const byLang = (lang: Lang) => (entry: { id: string }) => entry.id.startsWith(`${lang}/`);

export async function getServices(lang: Lang): Promise<CollectionEntry<'services'>[]> {
  const all = await getCollection('services', byLang(lang));
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getCaseStudies(lang: Lang): Promise<CollectionEntry<'caseStudies'>[]> {
  const all = await getCollection('caseStudies', byLang(lang));
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getInsights(lang: Lang): Promise<CollectionEntry<'insights'>[]> {
  const all = await getCollection('insights', (e) => byLang(lang)(e) && !e.data.draft);
  return all.sort((a, b) => (a.data.date < b.data.date ? 1 : -1));
}

export async function getTeam(lang: Lang): Promise<CollectionEntry<'team'>[]> {
  const all = await getCollection('team', byLang(lang));
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** strip the "en/" | "fr/" prefix from a content id to get the bare slug */
export const bareSlug = (id: string) => id.replace(/^(en|fr)\//, '').replace(/\.md$/, '');
