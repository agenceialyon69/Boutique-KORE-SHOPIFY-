import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Crée les collections de la boutique (data/collections.json). */
export default async function createCollections({ shopify, apply }) {
  const dataPath = path.join(__dirname, '..', 'data', 'collections.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const existing = await shopify.getAll('custom_collections', 'custom_collections');

  for (const c of data) {
    const found = existing.find((x) => x.title.toLowerCase() === c.title.toLowerCase());
    console.log(`• ${c.title}  ${found ? '(existe déjà → ignorée)' : '(création)'}`);

    if (apply && !found) {
      await shopify.rest('POST', 'custom_collections.json', {
        custom_collection: { title: c.title, body_html: c.body_html, published: true },
      });
    }
  }
  console.log(`\n${apply ? 'Collections créées ✍️' : 'Simulation terminée'}.`);
  console.log('💡 Ajoute ensuite tes produits dans chaque collection (ou crée des règles automatiques).');
}
