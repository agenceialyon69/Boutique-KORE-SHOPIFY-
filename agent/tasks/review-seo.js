import { askClaude, parseJson } from '../lib/claude.js';

/** review-seo : Claude optimise méta-titre + méta-description SEO de chaque produit. */
const SYSTEM = `Tu es le SEO Officer de KORE (activewear féminin, France, korewear.fr).
Pour un produit, propose un MÉTA-TITRE (50-60 caractères, finir par « | KORE ») et une
MÉTA-DESCRIPTION (140-160 caractères, bénéfice + réassurance + « — KORE »). Français impeccable.
INTERDIT : fausses allégations, prix barré, fausse urgence, bourrage de mots-clés.
Tu ne changes QUE si ça améliore le KPI SEO (clic, visibilité) clairement.
Réponds UNIQUEMENT en JSON : {"changed": true|false, "meta_title": "…", "meta_description": "…",
 "kpi": "SEO", "impact": "faible|moyen|élevé", "confiance": "0-100%", "risque": "faible|moyen|élevé", "raison": "…"}`;

async function getMeta(shopify, productId) {
  const { json } = await shopify.rest('GET', `products/${productId}/metafields.json`);
  const metas = json.metafields || [];
  return {
    title: metas.find((m) => m.namespace === 'global' && m.key === 'title_tag'),
    desc: metas.find((m) => m.namespace === 'global' && m.key === 'description_tag'),
  };
}

async function setMeta(shopify, productId, key, value) {
  await shopify.rest('POST', `products/${productId}/metafields.json`, {
    metafield: { namespace: 'global', key, type: 'single_line_text_field', value },
  });
}

export default async function reviewSeo({ shopify, apply, cfg }) {
  if (!cfg.claudeApiKey || /x{4,}/i.test(cfg.claudeApiKey)) throw new Error('claudeApiKey manquant.');
  const model = cfg.claudeModel || 'claude-sonnet-4-6';
  const products = await shopify.getAll('products', 'products');
  console.log(`🤖 SEO — ${products.length} produit(s) (discipline KPI).\n`);
  let changed = 0;
  for (const p of products) {
    const meta = await getMeta(shopify, p.id);
    const user =
      `Produit : ${p.title}\nMéta-titre actuel : ${meta.title?.value || '(vide)'}\n` +
      `Méta-description actuelle : ${meta.desc?.value || '(vide)'}\n\nPropose le SEO optimisé. JSON.`;
    let out;
    try { out = parseJson(await askClaude({ apiKey: cfg.claudeApiKey, model, system: SYSTEM, user })); }
    catch (e) { console.log(`⚠️  "${p.title}" — réponse illisible (${e.message}).`); continue; }
    if (!out.changed) { console.log(`✓  "${p.title}" — SEO déjà bon.`); continue; }
    changed++;
    console.log(`• "${p.title}"\n   Titre SEO → ${out.meta_title}\n   Desc SEO → ${out.meta_description}\n   impact : ${out.impact} | confiance : ${out.confiance} | risque : ${out.risque}`);
    if (apply) {
      if (out.meta_title) await setMeta(shopify, p.id, 'title_tag', out.meta_title);
      if (out.meta_description) await setMeta(shopify, p.id, 'description_tag', out.meta_description);
    }
  }
  console.log(`\n${changed} produit(s) ${apply ? 'optimisé(s) SEO ✍️' : 'à optimiser (simulation)'}.`);
}
