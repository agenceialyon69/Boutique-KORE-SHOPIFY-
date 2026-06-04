import { loadConfig, Shopify } from './lib/shopify.js';
import audit from './tasks/audit.js';
import fixBrand from './tasks/fix-brand.js';
import applyProducts from './tasks/apply-products.js';
import createPages from './tasks/create-pages.js';
import createCollections from './tasks/create-collections.js';
import reviewProducts from './tasks/review-products.js';
import reviewPages from './tasks/review-pages.js';
import reviewCollections from './tasks/review-collections.js';
import reviewSeo from './tasks/review-seo.js';
import analyzeTheme from './tasks/analyze-theme.js';

const tasks = {
  audit,
  'fix-brand': fixBrand,
  'apply-products': applyProducts,
  'create-pages': createPages,
  'create-collections': createCollections,
  'review-products': reviewProducts,
  'review-pages': reviewPages,
  'review-collections': reviewCollections,
  'review-seo': reviewSeo,
  'analyze-theme': analyzeTheme,
};

const HELP = `
🤖 Agent KORE — automatisation de la boutique Shopify

Usage :
  node index.js <tâche> [--apply]

Tâches disponibles :
  audit                Analyse la boutique et liste les problèmes   (lecture seule)
  fix-brand            Supprime « ŌKEI » des titres + vendor → KORE
  apply-products       Applique titres / descriptions / SEO réécrits
  create-pages         Crée les pages (À propos, FAQ, mentions légales, CGV…)
  create-collections   Crée les collections (Homme, Femme, Accessoires…)
  review-products      🤖 IA Claude relit + corrige chaque produit en RED TEAM
  review-pages         🤖 IA relit les pages (légales, à propos, FAQ)
  review-collections   🤖 IA relit titres + descriptions de collections
  review-seo           🤖 IA optimise méta-titres + méta-descriptions SEO
  analyze-theme        🤖 IA LIT le thème et propose un PLAN (n'applique jamais)

Sécurité :
  • SANS --apply  → SIMULATION : montre ce qui serait fait, ne modifie RIEN.
  • AVEC --apply  → applique réellement les changements.

Exemples :
  node index.js audit
  node index.js fix-brand            (simulation)
  node index.js fix-brand --apply    (application réelle)
`;

const [, , task, ...rest] = process.argv;
const apply = rest.includes('--apply');

if (!task || !tasks[task]) {
  console.log(HELP);
  process.exit(task && !tasks[task] ? 1 : 0);
}

try {
  const cfg = loadConfig();
  const shopify = new Shopify(cfg);
  console.log(`\n▶  Boutique : ${shopify.shop}`);
  console.log(`▶  Tâche    : ${task} ${apply ? '— MODE APPLICATION ✍️' : '— SIMULATION 👀 (rien modifié)'}\n`);

  await tasks[task]({ shopify, apply, cfg });

  console.log(`\n✅ Terminé.${apply ? '' : '  → Relance avec --apply pour appliquer réellement.'}\n`);
} catch (e) {
  console.error(`\n❌ Erreur : ${e.message}\n`);
  process.exit(1);
}
