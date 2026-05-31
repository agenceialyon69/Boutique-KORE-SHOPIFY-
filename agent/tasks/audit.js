/** Analyse la boutique en lecture seule et liste les points à améliorer. */
export default async function audit({ shopify }) {
  const products = await shopify.getAll('products', 'products');
  console.log(`📦 ${products.length} produit(s) trouvé(s).\n`);

  let withIssues = 0;
  for (const p of products) {
    const probs = [];
    if (/ŌKEI|OKEI|ÔKEI/i.test(p.title)) probs.push('le titre contient « ŌKEI »');
    if (p.vendor && /ŌKEI|OKEI|ÔKEI/i.test(p.vendor)) probs.push(`le fournisseur est "${p.vendor}" (devrait être KORE)`);
    const textLen = (p.body_html || '').replace(/<[^>]+>/g, '').trim().length;
    if (textLen < 80) probs.push('description trop courte ou absente');
    const imgs = (p.images || []).length;
    if (imgs < 2) probs.push(`seulement ${imgs} image(s) (vise 3 à 5)`);

    if (probs.length) {
      withIssues++;
      console.log(`• ${p.title}`);
      probs.forEach((x) => console.log(`     ⚠️  ${x}`));
    }
  }

  // Vérif pages essentielles
  const pages = await shopify.getAll('pages', 'pages');
  const needed = ['mention', 'cgv', 'confidential', 'livraison', 'retour', 'faq', 'contact', 'propos', 'histoire'];
  const haveTitles = pages.map((p) => (p.title + ' ' + p.handle).toLowerCase());
  const missing = needed.filter((kw) => !haveTitles.some((t) => t.includes(kw)));

  console.log('\n— Pages —');
  console.log(`📄 ${pages.length} page(s) existante(s).`);
  if (missing.length) console.log(`⚠️  Pages probablement manquantes (mots-clés) : ${missing.join(', ')}`);

  console.log('\n========================================');
  if (!withIssues) console.log('🎉 Produits : aucun problème majeur détecté.');
  else console.log(`⚠️  ${withIssues} produit(s) à améliorer (voir ci-dessus).`);
  console.log('💡 Prochaines tâches conseillées : fix-brand → apply-products → create-pages → create-collections');
}
