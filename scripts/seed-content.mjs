// Generates the bilingual seed content for all collections.
// Run: node scripts/seed-content.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const write = (rel, body) => {
  const p = resolve(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, body.trimStart());
  console.log('wrote', rel);
};
const fm = (obj) => {
  const lines = Object.entries(obj).map(([k, v]) => {
    if (Array.isArray(v)) {
      if (v.length && typeof v[0] === 'object')
        return `${k}:\n${v.map((o) => '  - { ' + Object.entries(o).map(([a, b]) => `${a}: ${JSON.stringify(b)}`).join(', ') + ' }').join('\n')}`;
      return `${k}: [${v.map((x) => JSON.stringify(x)).join(', ')}]`;
    }
    return `${k}: ${typeof v === 'string' ? JSON.stringify(v) : v}`;
  });
  return `---\n${lines.join('\n')}\n---\n`;
};

// ── SERVICES (canonical 7) ──────────────────────────────────
const services = [
  { slug: 'fundraising', icon: 'fundraising', featured: true,
    en: { title: 'Fundraising & Resource Mobilisation', short: 'Fundraising & Resource Mobilisation',
      summary: 'Public fundraising and sustainable investment for structured initiatives — connecting credible projects to the capital and partners that make them possible.',
      body: 'We help institutions and enterprises design fundraising strategies that attract sustainable, mission-aligned capital. From framing the case for investment to convening the right partners, we connect credible public projects with the resources they need to move.' },
    fr: { title: 'Financement & Mobilisation des ressources', short: 'Financement & Mobilisation',
      summary: 'Financement public et investissement durable pour des initiatives structurées — reliant des projets crédibles aux capitaux et partenaires qui les rendent possibles.',
      body: 'Nous aidons les institutions et les entreprises à concevoir des stratégies de financement attirant des capitaux durables et alignés sur leur mission. Du cadrage de la proposition d’investissement à la réunion des bons partenaires, nous relions des projets publics crédibles aux ressources dont ils ont besoin.' } },
  { slug: 'investment', icon: 'investment', featured: false,
    en: { title: 'Sustainable Investment & Public Projects', short: 'Sustainable Investment',
      summary: 'Facilitating sustainable investment and the development of structured public projects — shaping initiatives that are bankable, accountable, and built to deliver.',
      body: 'We structure public projects so they are bankable and accountable from day one — aligning objectives, governance, and financing into initiatives investors can trust and communities can rely on.' },
    fr: { title: 'Investissement durable & Projets publics', short: 'Investissement durable',
      summary: 'Faciliter l’investissement durable et le développement de projets publics structurés — des initiatives bancables, responsables et conçues pour livrer.',
      body: 'Nous structurons les projets publics pour qu’ils soient bancables et responsables dès le départ — en alignant objectifs, gouvernance et financement en initiatives auxquelles les investisseurs peuvent se fier.' } },
  { slug: 'partnerships', icon: 'partnerships', featured: true,
    en: { title: 'Public–Private Partnerships', short: 'Public–Private Partnerships',
      summary: 'Designing and advancing PPP initiatives that align public objectives with private capability — partnerships that share risk fairly and create lasting value.',
      body: 'We design public–private partnerships that share risk fairly and align public objectives with private capability and capital — from first framing through to a structure that holds.' },
    fr: { title: 'Partenariats public–privé', short: 'Partenariats public–privé',
      summary: 'Concevoir et faire avancer des PPP qui alignent objectifs publics et capacités privées — des partenariats qui partagent le risque équitablement et créent une valeur durable.',
      body: 'Nous concevons des partenariats public–privé qui partagent le risque équitablement et alignent les objectifs publics sur les capacités et capitaux privés — du premier cadrage à une structure qui tient.' } },
  { slug: 'legal', icon: 'legal', featured: false,
    en: { title: 'Legal Advisory', short: 'Legal Advisory',
      summary: 'Legal advisory to commercial companies — helping enterprises navigate regulation, structure sound agreements, and operate with confidence.',
      body: 'We advise commercial enterprises on the legal architecture of their operations — regulation, agreements, and structure — so they can act with confidence in complex environments.' },
    fr: { title: 'Conseil juridique', short: 'Conseil juridique',
      summary: 'Conseil juridique aux entreprises commerciales — les aider à naviguer la réglementation, structurer des accords solides et opérer avec confiance.',
      body: 'Nous conseillons les entreprises sur l’architecture juridique de leurs activités — réglementation, accords et structure — afin qu’elles agissent avec confiance dans des environnements complexes.' } },
  { slug: 'governance', icon: 'governance', featured: true,
    en: { title: 'Governance & Leadership', short: 'Governance & Leadership',
      summary: 'Promoting leadership and good governance in public management — advising institutions on transparency, accountability, and effective decision-making.',
      body: 'We help public institutions strengthen governance and leadership — advising on transparency, accountability, and the decision-making structures that build lasting public trust.' },
    fr: { title: 'Gouvernance & Leadership', short: 'Gouvernance & Leadership',
      summary: 'Promouvoir le leadership et la bonne gouvernance dans la gestion publique — conseiller sur la transparence, la responsabilité et une prise de décision efficace.',
      body: 'Nous aidons les institutions publiques à renforcer gouvernance et leadership — en conseillant sur la transparence, la responsabilité et les structures de décision qui bâtissent une confiance durable.' } },
  { slug: 'capacity', icon: 'capacity', featured: true,
    en: { title: 'Institutional & Operational Capacity', short: 'Institutional Capacity',
      summary: 'Training programmes that strengthen institutional and operational capacity — equipping teams to perform, adapt, and sustain results over time.',
      body: 'We build institutional and operational capacity through training and advisory that equips teams to perform, adapt, and sustain results long after an engagement ends.' },
    fr: { title: 'Capacité institutionnelle & opérationnelle', short: 'Capacité institutionnelle',
      summary: 'Des programmes de formation qui renforcent la capacité institutionnelle et opérationnelle — pour des équipes qui performent, s’adaptent et durent.',
      body: 'Nous renforçons la capacité institutionnelle et opérationnelle par la formation et le conseil, dotant les équipes des moyens de performer et de durer bien après la mission.' } },
  { slug: 'collaboration', icon: 'collaboration', featured: false,
    en: { title: 'Multi-Stakeholder Collaboration', short: 'Multi-Stakeholder Collaboration',
      summary: 'Facilitating collaboration between governments, businesses, development partners, and communities — building the coalitions that complex initiatives require.',
      body: 'We convene and facilitate the coalitions complex initiatives require — bringing governments, businesses, development partners, and communities into durable, working collaboration.' },
    fr: { title: 'Collaboration multi-acteurs', short: 'Collaboration multi-acteurs',
      summary: 'Faciliter la collaboration entre gouvernements, entreprises, partenaires au développement et communautés — bâtir les coalitions qu’exigent les initiatives complexes.',
      body: 'Nous réunissons et facilitons les coalitions qu’exigent les initiatives complexes — gouvernements, entreprises, partenaires au développement et communautés en collaboration durable.' } },
];
services.forEach((s, i) => {
  ['en', 'fr'].forEach((lang) => {
    const d = s[lang];
    write(`src/content/services/${lang}/${s.slug}.md`,
      fm({ lang, order: i + 1, title: d.title, summary: d.summary, short: d.short, icon: s.icon, featured: s.featured }) + `\n${d.body}\n`);
  });
});

// ── CASE STUDIES ────────────────────────────────────────────
const cases = [
  { slug: 'embassy-sweden-lyrec', order: 1, featured: true, cover: 'africa1',
    gallery: ['africa1', 'africa3', 'africa2', 'africa4'],
    partner: 'Embassy of Sweden', beneficiary: 'LYREC — Youth Civil Society',
    programme: 'Governance · Democracy · Youth', location: 'Kinshasa, DR Congo', date: '2022',
    tags: ['Diplomacy', 'Partnership'],
    outcomes: [{ n: '3', l: 'provinces reached beyond the capital' }, { n: '1', l: 'youth civil-society platform equipped' }, { n: '4yr', l: 'bilateral cooperation sustained' }],
    en: { title: 'Embassy of Sweden × LYREC',
      excerpt: 'A partnership to put young people at the centre of governance for sustainable development in the DR Congo.',
      body: `Africa 63 supported the partnership between the Embassy of Sweden and LYREC — a platform bringing together civil-society youth organisations across the Democratic Republic of the Congo. The collaboration was designed to strengthen youth participation in governance, deepening the role young citizens play in shaping public decisions and sustainable development.

Delivered under the LYREC–LSU partnership — alongside the National Youth Council of Sweden — the engagement provided the platform with the means to extend its work into the field. With this support, LYREC was equipped to reach communities across Central Congo, Kwilu, and Central Kasaï, carrying citizen engagement in public governance well beyond the capital.

The engagement reflects how Africa 63 works: convening credible partners, structuring the collaboration, and ensuring the outcome serves the communities at its centre — durable participation, stronger institutions, and trust that outlasts any single project.` },
    fr: { title: 'Ambassade de Suède × LYREC',
      excerpt: 'Un partenariat pour placer la jeunesse au cœur de la gouvernance pour le développement durable en RD Congo.',
      body: `Africa 63 a accompagné le partenariat entre l’Ambassade de Suède et LYREC — une plateforme réunissant des organisations de jeunesse de la société civile à travers la République démocratique du Congo. La collaboration visait à renforcer la participation des jeunes à la gouvernance et le rôle des jeunes citoyens dans les décisions publiques.

Mené dans le cadre du partenariat LYREC–LSU — aux côtés du Conseil national de la jeunesse de Suède — l’engagement a donné à la plateforme les moyens d’étendre son action sur le terrain, jusqu’aux communautés du Congo central, du Kwilu et du Kasaï central.

Cet engagement illustre la manière de travailler d’Africa 63 : réunir des partenaires crédibles, structurer la collaboration et veiller à ce que le résultat serve les communautés — participation durable, institutions renforcées et confiance qui perdure.` } },
  { slug: 'ppp-infrastructure-framework', order: 2, featured: false, cover: 'engagement-scene',
    gallery: ['engagement-scene', 'africa2'],
    partner: 'Public Institutions', beneficiary: 'National Development Programme',
    programme: 'Public–Private Partnerships', location: 'Central Africa', date: '2023',
    tags: ['PPP', 'Structuring'],
    outcomes: [{ n: '—', l: 'structured project pipeline' }, { n: '—', l: 'risk-sharing framework' }],
    en: { title: 'Structuring a PPP Framework', excerpt: 'Draft engagement — a public–private framework aligning objectives, governance, and financing. (Content to be finalised.)',
      body: `*This is a scaffold entry to be completed by Africa 63.* It illustrates how a public–private partnership engagement is structured on this site: objectives, governance, risk-sharing, and outcomes.` },
    fr: { title: 'Structurer un cadre de PPP', excerpt: 'Engagement provisoire — un cadre public–privé alignant objectifs, gouvernance et financement. (Contenu à finaliser.)',
      body: `*Entrée provisoire à compléter par Africa 63.* Elle illustre la structuration d’un partenariat public–privé sur ce site : objectifs, gouvernance, partage du risque et résultats.` } },
  { slug: 'institutional-capacity-programme', order: 3, featured: false, cover: 'africa4',
    gallery: ['africa4', 'africa3'],
    partner: 'Development Partners', beneficiary: 'Public Institutions',
    programme: 'Institutional Capacity', location: 'DR Congo', date: '2023',
    tags: ['Capacity', 'Training'],
    outcomes: [{ n: '—', l: 'teams trained' }, { n: '—', l: 'systems strengthened' }],
    en: { title: 'Institutional Capacity Programme', excerpt: 'Draft engagement — training and advisory that strengthens institutional and operational capacity. (Content to be finalised.)',
      body: `*This is a scaffold entry to be completed by Africa 63.* It shows how a capacity-building engagement appears as a full case study.` },
    fr: { title: 'Programme de capacité institutionnelle', excerpt: 'Engagement provisoire — formation et conseil renforçant la capacité institutionnelle et opérationnelle. (Contenu à finaliser.)',
      body: `*Entrée provisoire à compléter par Africa 63.* Elle montre comment un engagement de renforcement de capacités apparaît en étude de cas complète.` } },
];
cases.forEach((c) => {
  ['en', 'fr'].forEach((lang) => {
    const d = c[lang];
    write(`src/content/caseStudies/${lang}/${c.slug}.md`,
      fm({ lang, title: d.title, partner: c.partner, beneficiary: c.beneficiary, programme: c.programme,
        location: c.location, date: c.date, order: c.order, featured: c.featured, tags: c.tags, cover: c.cover,
        gallery: c.gallery, outcomes: c.outcomes, excerpt: d.excerpt }) + `\n${d.body}\n`);
  });
});

// ── INSIGHTS ────────────────────────────────────────────────
const insights = [
  { slug: 'trust-as-infrastructure', date: '2026-05-12', author: 'Africa 63', category: 'Perspective', cover: 'texture-glow',
    en: { title: 'Trust as Infrastructure', excerpt: 'Why the most durable public outcomes are built on relationships, not transactions.',
      body: `In public affairs, the temptation is to measure progress in announcements. But the outcomes that endure are rarely the loudest. They are built on trust — between governments, businesses, development partners, and the communities they serve.\n\nTrust behaves like infrastructure: invisible when it works, catastrophic when it fails, and expensive to rebuild once broken. This piece sets out how Africa 63 treats trust as something to be engineered deliberately — through evidence, discretion, and consistency.` },
    fr: { title: 'La confiance comme infrastructure', excerpt: 'Pourquoi les résultats publics les plus durables reposent sur des relations, non sur des transactions.',
      body: `En affaires publiques, la tentation est de mesurer le progrès en annonces. Mais les résultats qui durent sont rarement les plus bruyants. Ils reposent sur la confiance — entre gouvernements, entreprises, partenaires au développement et communautés.\n\nLa confiance se comporte comme une infrastructure : invisible quand elle fonctionne, catastrophique quand elle échoue. Ce texte expose comment Africa 63 traite la confiance comme quelque chose à bâtir délibérément.` } },
  { slug: 'bankable-public-projects', date: '2026-03-20', author: 'Africa 63', category: 'Analysis', cover: 'texture-warm',
    en: { title: 'What Makes a Public Project Bankable', excerpt: 'The difference between a good idea and a fundable one is structure.',
      body: `Capital does not flow to ambition alone. It flows to structure — to projects where objectives, governance, and financing are aligned and accountable. This analysis outlines the ingredients that move a public initiative from a good idea to a fundable one.` },
    fr: { title: 'Ce qui rend un projet public bancable', excerpt: 'La différence entre une bonne idée et une idée finançable, c’est la structure.',
      body: `Le capital ne suit pas la seule ambition. Il suit la structure — des projets où objectifs, gouvernance et financement sont alignés et responsables. Cette analyse décrit les ingrédients qui font passer une initiative publique de bonne idée à projet finançable.` } },
  { slug: 'youth-and-governance', date: '2026-01-28', author: 'Africa 63', category: 'Field Note', cover: 'engagement-scene',
    en: { title: 'Youth at the Centre of Governance', excerpt: 'Field reflections on widening civic participation beyond the capital.',
      body: `Extending civic participation beyond a capital city is not a logistics problem — it is a trust problem. Drawing on engagements across Central Congo, Kwilu, and Central Kasaï, this field note reflects on what it takes to put young citizens at the centre of public decisions.` },
    fr: { title: 'La jeunesse au cœur de la gouvernance', excerpt: 'Réflexions de terrain sur l’élargissement de la participation citoyenne au-delà de la capitale.',
      body: `Étendre la participation citoyenne au-delà de la capitale n’est pas un problème de logistique — c’est un problème de confiance. À partir d’engagements au Congo central, au Kwilu et au Kasaï central, cette note de terrain réfléchit à ce qu’il faut pour placer les jeunes au cœur des décisions publiques.` } },
];
insights.forEach((n) => {
  ['en', 'fr'].forEach((lang) => {
    const d = n[lang];
    write(`src/content/insights/${lang}/${n.slug}.md`,
      fm({ lang, title: d.title, date: n.date, author: n.author, category: n.category, excerpt: d.excerpt, cover: n.cover, draft: false }) + `\n${d.body}\n`);
  });
});

// ── TEAM (placeholders — client completes) ──────────────────
const team = [
  { slug: 'principal', order: 1, photo: 'headshot-02', en: { name: 'Name Surname', role: 'Founder & Principal' }, fr: { name: 'Nom Prénom', role: 'Fondateur & Associé principal' } },
  { slug: 'director-partnerships', order: 2, photo: 'headshot-01', en: { name: 'Name Surname', role: 'Director, Partnerships' }, fr: { name: 'Nom Prénom', role: 'Directrice, Partenariats' } },
  { slug: 'lead-governance', order: 3, photo: 'headshot-02', en: { name: 'Name Surname', role: 'Lead, Governance & Leadership' }, fr: { name: 'Nom Prénom', role: 'Responsable, Gouvernance & Leadership' } },
  { slug: 'lead-capacity', order: 4, photo: 'headshot-01', en: { name: 'Name Surname', role: 'Lead, Institutional Capacity' }, fr: { name: 'Nom Prénom', role: 'Responsable, Capacité institutionnelle' } },
];
team.forEach((m) => {
  ['en', 'fr'].forEach((lang) => {
    const d = m[lang];
    write(`src/content/team/${lang}/${m.slug}.md`,
      fm({ lang, name: d.name, role: d.role, order: m.order, photo: m.photo, placeholder: true }) +
      `\n${lang === 'fr' ? 'Biographie à compléter par Africa 63.' : 'Biography to be completed by Africa 63.'}\n`);
  });
});

console.log('\nSeed complete.');
