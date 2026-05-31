/** Supprime « ŌKEI » des titres de produits et corrige le fournisseur → KORE. */
export default async function fixBrand({ shopify, apply, cfg }) {
  const brand = cfg.brand || 'KORE';
  const products = await shopify.getAll('products', 'products');
  let changed = 0;

  for (const p of products) {
    const newTitle = p.title
      .replace(/\s*[—\-–]\s*(ŌKEI|OKEI|ÔKEI)\s*$/i, '') // "… — ŌKEI" en fin de titre
      .replace(/\s*(ŌKEI|OKEI|ÔKEI)\s*/gi, ' ')          // toute autre occurrence
      .replace(/\s{2,}/g, ' ')
      .trim();
    const fixVendor = p.vendor && /ŌKEI|OKEI|ÔKEI/i.test(p.vendor);

    if (newTitle !== p.title || fixVendor) {
      changed++;
      const parts = [];
      if (newTitle !== p.title) parts.push(`titre → "${newTitle}"`);
      if (fixVendor) parts.push(`fournisseur → ${brand}`);
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
