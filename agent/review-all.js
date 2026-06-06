import { loadConfig, Shopify } from './lib/shopify.js';
import reviewProducts from './tasks/review-products.js';
import reviewPages from './tasks/review-pages.js';
import reviewCollections from './tasks/review-collections.js';
import reviewSeo from './tasks/review-seo.js';

/** Revue COMPLÈTE en red team : produits + pages + collections + SEO, en une commande.
 *  node review-all.js           → simulation (rien modifié)
 *  node review-all.js --apply   → applique après ta validation
 */
const cfg = loadConfig();
const shopify = new Shopify(cfg);
const apply = process.argv.includes('--apply');
const ctx = { shopify, apply, cfg };

console.log(`\n🤖 REVUE COMPLÈTE KORE — ${apply ? 'APPLICATION ✍️' : 'SIMULATION 👀 (rien modifié)'}`);

const etapes = [
  ['PRODUITS', reviewProducts],
  ['PAGES', reviewPages],
  ['COLLECTIONS', reviewCollections],
  ['SEO', reviewSeo],
];
for (const [nom, fn] of etapes) {
  console.log(`\n========== ${nom} ==========`);
  try { await fn(ctx); }
  catch (e) { console.log(`⚠️  ${nom} : ${e.message}`); }
}
console.log(`\n✅ Revue complète terminée.${apply ? '' : '  → Relance avec --apply pour appliquer.'}`);
