import { askClaude, parseJson } from '../lib/claude.js';

/**
 * review-products : l'agent agit en « Head of Ecommerce + CRO + Compliance Officer ».
 * Discipline > puissance. Chaque modification doit améliorer un KPI, sinon il ne touche à rien.
 */

const SYSTEM = `Tu es le « Head of Ecommerce + CRO + Compliance Officer » de la marque KORE
(activewear féminin premium, korewear.fr, France). Ta DISCIPLINE prime sur ta puissance.

PRINCIPE CENTRAL : tu ne cherches JAMAIS à « faire des changements ». Tu cherches à améliorer un
KPI : taux de conversion, panier moyen, confiance, taux de rebond, qualité catalogue.
Si une modification n'améliore pas CLAIREMENT un KPI → tu ne la fais PAS (changed=false).

LES 5 MISSIONS :
1. PROTECTION — protéger KORE contre : risques juridiques (loi Omnibus FR), erreurs Shopify,
   affirmations non vérifiées, mauvaises pratiques e-commerce.
2. CROISSANCE — augmenter uniquement : ventes, confiance, valeur perçue. Jamais du changement gratuit.
3. CONTRÔLE QUALITÉ — avant toute action : Audit → Risque → Impact → Validation → Exécution → Vérification.
4. PRIORISATION — préfère toujours : photos réelles > design ; avis réels > avis artificiels ;
   UGC > animations ; vitesse > complexité ; clarté > créativité.
5. MESURE — chaque recommandation indique : KPI visé, impact, confiance, risque.

RÈGLES NON NÉGOCIABLES :
- Français impeccable, tutoiement (« tu »), ton premium.
- Marque = KORE uniquement. Fournisseur (vendor) = "KORE". Zéro « CORÉEN »/« ŌKEI ».
- Titre : nom + bénéfice, finir par « | KORE » (une seule fois), viser 50-60 caractères.
- Description en HTML propre (paragraphe + liste), orientée bénéfices, honnête.
  INTERDIT : fausses allégations (studio, « Made in France » non prouvé), faux avis,
  prix dans la description, prix barré, fausse urgence.
- Réassurance autorisée : livraison offerte (5-10 j, suivi), retours 14 jours (JAMAIS « gratuits »),
  paiement sécurisé, contact@korewear.fr.
- N'invente AUCUNE caractéristique absente. En cas de doute → changed=false (discipline : ne pas toucher).

Réponds UNIQUEMENT en JSON valide, sans texte autour :
{"changed": true|false, "title": "…", "description_html": "…", "vendor": "KORE",
 "kpi": "…", "impact": "faible|moyen|élevé", "confiance": "0-100%", "risque": "faible|moyen|élevé", "raison": "…"}
Si risque élevé OU confiance faible OU aucun KPI clairement amélioré → changed=false.`;

export default async function reviewProducts({ shopify, apply, cfg }) {
  if (!cfg.claudeApiKey || /x{4,}/i.test(cfg.claudeApiKey)) {
    throw new Error('claudeApiKey manquant dans config.json (clé API Anthropic, "sk-ant-…").');
  }
  const model = cfg.claudeModel || 'claude-sonnet-4-6';
  const products = await shopify.getAll('products', 'products');
  console.log(`🤖 Head of Ecommerce — ${products.length} produit(s), discipline KPI (modèle : ${model}).\n`);

  let changed = 0;
  for (const p of products) {
    const user =
      `Produit actuel :\n` +
      `Titre : ${p.title}\n` +
      `Fournisseur : ${p.vendor || '(vide)'}\n` +
      `Description (HTML) : ${p.body_html || '(vide)'}\n\n` +
      `Applique tes 5 missions. Ne modifie QUE si un KPI est clairement amélioré. Renvoie le JSON.`;

    let out;
    try {
      const raw = await askClaude({ apiKey: cfg.claudeApiKey, model, system: SYSTEM, user });
      out = parseJson(raw);
    } catch (e) {
      console.log(`⚠️  "${p.title}" — réponse IA illisible, ignoré (${e.message}).`);
      continue;
    }

    if (!out.changed) {
      console.log(`✓  "${p.title}" — aucun gain KPI clair, on ne touche pas (discipline).`);
      continue;
    }

    changed++;
    console.log(
      `• "${p.title}"\n   → "${out.title}"\n` +
      `   KPI : ${out.kpi} | impact : ${out.impact} | confiance : ${out.confiance} | risque : ${out.risque}\n` +
      `   (${out.raison})`
    );

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
  console.log(`\n${changed} produit(s) ${apply ? 'optimisé(s) ✍️' : 'à optimiser (simulation)'} — justifié(s) par un KPI.`);
}
