/** Nettoie la marque : retire « ŌKEI » et « CORÉEN » des titres, et force le fournisseur → KORE. */
export default async function fixBrand({ shopify, apply, cfg }) {
  const brand = cfg.brand || 'KORE';
  const products = await shopify.getAll('products', 'products');
  let changed = 0;

  // Mots parasites à retirer des titres (ŌKEI, CORÉEN et variantes)
  const STRIP = /\s*[—\-–]?\s*(ŌKEI|OKEI|ÔKEI|CORÉEN|COREEN|CORÉENNE|COREENNE)\s*/gi;

  for (const p of products) {
    const newTitle = p.title
      .replace(STRIP, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // Force le fournisseur à KORE pour TOUT produit dont le vendeur n'est pas déjà KORE
    const currentVendor = (p.vendor || '').trim();
    const fixVendor = currentVendor.toUpperCase() !== brand.toUpperCase();

    if (newTitle !== p.title || fixVendor) {
      changed++;
      const parts = [];
      if (newTitle !== p.title) parts.push(`titre → "${newTitle}"`);
      if (fixVendor) parts.push(`fournisseur "${currentVendor || '(vide)'}" → ${brand}`);
      console.log(`• "${p.title}"  [${parts.join(' | ')}]`);

      if (apply) {
        const product = { id: p.id };
        if (newTitle !== p.title) product.title = newTitle;
        if (fixVendor) product.vendor = brand;
        await shopify.rest('PUT', `products/${p.id}.json`, { product });
      }
    }
  }
  console.log(`\n${changed} produit(s) ${apply ? 'modifié(s) ✍️' : 'à modifier (simulation)'}.`);
}
