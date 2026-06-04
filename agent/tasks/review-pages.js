import { askClaude, parseJson } from '../lib/claude.js';

/** review-pages : Claude relit les pages (légales, à propos, FAQ) en red team KORE. */
const SYSTEM = `Tu es le Compliance + Copywriting Officer de KORE (activewear féminin, France).
Tu relis une PAGE de la boutique. RÈGLES : français impeccable, tutoiement, ton premium ;
marque KORE ; INTERDIT fausses allégations / faux avis / prix barré / fausse urgence ;
livraison offerte (5-10 j), retours 14 jours (jamais « gratuits »), contact@korewear.fr.
Tu ne modifies QUE si un KPI (confiance, conformité, clarté) s'améliore clairement.
NE TOUCHE PAS aux mentions légales chiffrées (SIRET, adresse) ni aux clauses juridiques.
Réponds UNIQUEMENT en JSON : {"changed": true|false, "title": "…", "body_html": "…",
 "kpi": "…", "impact": "faible|moyen|élevé", "confiance": "0-100%", "risque": "faible|moyen|élevé", "raison": "…"}`;

export default async function reviewPages({ shopify, apply, cfg }) {
  if (!cfg.claudeApiKey || /x{4,}/i.test(cfg.claudeApiKey)) throw new Error('claudeApiKey manquant.');
  const model = cfg.claudeModel || 'claude-sonnet-4-6';
  const pages = await shopify.getAll('pages', 'pages');
  console.log(`🤖 ${pages.length} page(s) à relire (discipline KPI).\n`);
  let changed = 0;
  for (const pg of pages) {
    const user = `Page :\nTitre : ${pg.title}\nContenu (HTML) : ${pg.body_html || '(vide)'}\n\nRelis en red team. Renvoie le JSON.`;
    let out;
    try { out = parseJson(await askClaude({ apiKey: cfg.claudeApiKey, model, system: SYSTEM, user })); }
    catch (e) { console.log(`⚠️  "${pg.title}" — réponse illisible (${e.message}).`); continue; }
    if (!out.changed) { console.log(`✓  "${pg.title}" — déjà bon (discipline).`); continue; }
    changed++;
    console.log(`• "${pg.title}"\n   KPI : ${out.kpi} | impact : ${out.impact} | confiance : ${out.confiance} | risque : ${out.risque}\n   (${out.raison})`);
    if (apply) await shopify.rest('PUT', `pages/${pg.id}.json`, { page: { id: pg.id, title: out.title || pg.title, body_html: out.body_html || pg.body_html } });
  }
  console.log(`\n${changed} page(s) ${apply ? 'optimisée(s) ✍️' : 'à optimiser (simulation)'}.`);
}
