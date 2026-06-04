import { askClaude, parseJson } from '../lib/claude.js';

/** review-collections : Claude relit titres + descriptions de collections en red team KORE. */
const SYSTEM = `Tu es le CRO + Copywriting Officer de KORE (activewear féminin, France).
Tu relis une COLLECTION. RÈGLES : français impeccable, tutoiement, ton premium ; marque KORE ;
description orientée bénéfices, honnête ; INTERDIT fausses allégations / faux avis / prix barré.
Tu ne modifies QUE si un KPI (conversion, clarté, SEO) s'améliore clairement.
Réponds UNIQUEMENT en JSON : {"changed": true|false, "title": "…", "body_html": "…",
 "kpi": "…", "impact": "faible|moyen|élevé", "confiance": "0-100%", "risque": "faible|moyen|élevé", "raison": "…"}`;

export default async function reviewCollections({ shopify, apply, cfg }) {
  if (!cfg.claudeApiKey || /x{4,}/i.test(cfg.claudeApiKey)) throw new Error('claudeApiKey manquant.');
  const model = cfg.claudeModel || 'claude-sonnet-4-6';
  const cols = [
    ...await shopify.getAll('custom_collections', 'custom_collections'),
    ...await shopify.getAll('smart_collections', 'smart_collections'),
  ];
  console.log(`🤖 ${cols.length} collection(s) à relire (discipline KPI).\n`);
  let changed = 0;
  for (const c of cols) {
    const user = `Collection :\nTitre : ${c.title}\nDescription (HTML) : ${c.body_html || '(vide)'}\n\nRelis en red team. Renvoie le JSON.`;
    let out;
    try { out = parseJson(await askClaude({ apiKey: cfg.claudeApiKey, model, system: SYSTEM, user })); }
    catch (e) { console.log(`⚠️  "${c.title}" — réponse illisible (${e.message}).`); continue; }
    if (!out.changed) { console.log(`✓  "${c.title}" — déjà bon (discipline).`); continue; }
    changed++;
    console.log(`• "${c.title}"\n   KPI : ${out.kpi} | impact : ${out.impact} | confiance : ${out.confiance} | risque : ${out.risque}\n   (${out.raison})`);
    const resource = c.rules ? 'smart_collections' : 'custom_collections';
    if (apply) await shopify.rest('PUT', `${resource}/${c.id}.json`, { [resource.slice(0, -1)]: { id: c.id, title: out.title || c.title, body_html: out.body_html || c.body_html } });
  }
  console.log(`\n${changed} collection(s) ${apply ? 'optimisée(s) ✍️' : 'à optimiser (simulation)'}.`);
}
