import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Applique les titres / descriptions / SEO réécrits (data/products.json). */
export default async function applyProducts({ shopify, apply }) {
  const dataPath = path.join(__dirname, '..', 'data', 'products.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const products = await shopify.getAll('products', 'products');

  for (const entry of data) {
    const matches = products.filter((p) =>
      p.title.toLowerCase().includes(entry.match.toLowerCase())
    );
    if (matches.length === 0) {
      console.log(`⏭️  Aucun produit ne correspond à « ${entry.match} »`);
      continue;
    }
    if (matches.length > 1) {
      console.log(`⚠️  ${matches.length} produits correspondent à « ${entry.match} » → application au 1er seulement.`);
    }
    const p = matches[0];
    console.log(`• "${p.title}"  →  "${entry.title}"`);

    if (apply) {
      const product = { id: p.id, title: entry.title };
      if (entry.body_html) product.body_html = entry.body_html;
      if (entry.seo) {
        product.metafields = [
          { namespace: 'global', key: 'title_tag', type: 'single_line_text_field', value: entry.seo.title },
          { namespace: 'global', key: 'description_tag', type: 'single_line_text_field', value: entry.seo.description },
        ];
      }
      await shopify.rest('PUT', `products/${p.id}.json`, { product });
    }
  }
  console.log(`\n${apply ? 'Descriptions appliquées ✍️' : 'Simulation terminée'}.`);
  console.log('💡 Complète ensuite les [ ] (matière, tailles) directement dans Shopify.');
}
