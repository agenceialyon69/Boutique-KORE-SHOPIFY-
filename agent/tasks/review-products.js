import { askClaude, parseJson } from '../lib/claude.js';

/**
 * review-products : pour chaque produit, Claude relit en RED TEAM et corrige
 * titre / description / fournisseur selon les règles KORE. Puis applique (avec --apply).
 */

const SYSTEM = `Tu es un expert e-commerce + copywriting français en mode RED TEAM pour la marque KORE
(activewear féminin premium, korewear.fr, marché France). Tu relis et optimises chaque produit.

RÈGLES STRICTES (non négociables) :
- Français impeccable, tutoiement (« tu »), ton premium et clair.
- Marque = KORE uniquement. Fournisseur (vendor) = "KORE". Retire toute mention « CORÉEN » ou « ŌKEI ».
- Titre : nom clair + bénéfice, finir par « | KORE » (une seule fois). Vise 50-60 caractères si possible.
- Description : orientée bénéfices, honnête, structurée en HTML (paragraphe + liste à puces).
  INTERDIT : fausses allégations (studio Paris, « Made in France » non prouvé, « testé X semaines »),
  faux avis, prix dans la description, prix barré, fausse urgence.
- Réassurance autorisée : livraison offerte (5-10 jours, suivi), retours 14 jours (JAMAIS « gratuits »),
  paiement sécurisé, contact@korewear.fr.
- N'invente AUCUNE caractéristique non présente. En cas de doute, reste générique mais vrai.

Réponds UNIQUEMENT en JSON valide, sans texte autour :
{"changed": true|false, "title": "…", "description_html": "…", "vendor": "KORE", "raison": "…"}
"changed"=false si le produit est déjà parfait. "description_html" = HTML propre.`;

export default async function reviewProducts({ shopify, apply, cfg }) {
  if (!cfg.claudeApiKey || /x{4,}/i.test(cfg.claudeApiKey)) {
    throw new Error('claudeApiKey manquant dans config.json (clé API Anthropic, commence par "sk-ant-…").');
  }
  const model = cfg.claudeModel || 'claude-sonnet-4-6';
  const products = await shopify.getAll('products', 'products');
  console.log(`🤖 ${products.length} produit(s) à relire en red team (modèle : ${model}).\n`);

  let changed = 0;
  for (const p of products) {
    const user =
      `Produit actuel :\n` +
      `Titre : ${p.title}\n` +
      `Fournisseur : ${p.vendor || '(vide)'}\n` +
      `Description (HTML) : ${p.body_html || '(vide)'}\n\n` +
      `Relis en red team et renvoie le JSON corrigé selon les règles.`;

    let out;
    try {
      const raw = await askClaude({ apiKey: cfg.claudeApiKey, model, system: SYSTEM, user });
      out = parseJson(raw);
    } catch (e) {
      console.log(`⚠️  "${p.title}" — réponse IA illisible, ignoré (${e.message}).`);
      continue;
    }

    if (!out.changed) {
      console.log(`✓  "${p.title}" — déjà bon.`);
      continue;
    }

    changed++;
    console.log(`• "${p.title}"\n   → "${out.title}"\n   (${out.raison})`);

    if (apply) {
      await shopify.rest('PUT', `products/${p.id}.json`, {
        product: {
          id: p.id,
          title: out.title || p.title,
          body_html: out.description_html || p.body_html,
          vendor: out.vendor || 'KORE',
        },
      });
    }
  }
  console.log(`\n${changed} produit(s) ${apply ? 'optimisé(s) par l\'IA ✍️' : 'à optimiser (simulation)'}.`);
}
