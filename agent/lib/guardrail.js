/** Garde-fou conformité : bloque toute proposition contenant une formulation interdite,
 *  ET vérifie les faits chiffrables (couleurs/tailles) contre les vraies données Shopify.
 *  Déterministe — ne dépend pas du « bon vouloir » de l'IA. */

const INTERDITS = [
  { re: /retours?\s+gratuit/i,                 label: '« retours gratuits »' },
  { re: /fabrication\s+responsable/i,           label: '« fabrication responsable » (non vérifié)' },
  { re: /(made\s+in|fabriqu[ée]\s+en)\s+france/i, label: '« Made in France » (non vérifié)' },
  { re: /confort\s+absolu/i,                     label: '« confort absolu » (superlatif)' },
  { re: /\b(le|la|les)\s+meilleurs?\b/i,         label: 'superlatif « meilleur »' },
  { re: /\bgaranti(e|es|s)?\b/i,                 label: '« garanti » (allégation)' },
  { re: /\b100\s*%/i,                            label: '« 100 % » (allégation)' },
  { re: /miracle/i,                              label: '« miracle »' },
  { re: /d[èe]s\s+\d/i,                          label: 'seuil de prix (« dès X € »)' },
  { re: /derni[èe]res?\s+pi[èe]ces/i,            label: 'fausse urgence' },
  { re: /plus\s+que\s+\d+/i,                     label: 'fausse urgence' },
  { re: /stock\s+limit[ée]/i,                    label: 'fausse urgence' },
  // ⛔ Allégations d'OPACITÉ — non vérifiables sans test physique. À RETIRER de cette liste
  //    UNIQUEMENT une fois l'opacité testée sur l'échantillon réel.
  { re: /squat[\s-]?proof/i,                     label: 'opacité non testée (« squat-proof »)' },
  { re: /\bopaques?\b/i,                         label: 'opacité non testée (« opaque »)' },
  { re: /non[\s-]?transparent/i,                 label: 'opacité non testée (« non transparent »)' },
  { re: /anti[\s-]?transparen/i,                 label: 'opacité non testée' },
];

/** Renvoie la liste des problèmes trouvés dans les textes donnés (vide = OK). */
export function violations(...texts) {
  const t = texts.filter(Boolean).join('  ');
  return INTERDITS.filter((f) => f.re.test(t)).map((f) => f.label);
}

/** Extrait les couleurs/tailles RÉELLES depuis les options Shopify du produit. */
export function productFacts(p = {}) {
  const opts = p.options || [];
  const find = (re) => (opts.find((o) => re.test(o.name || '')) || {}).values || [];
  return { colors: find(/couleur|color/i), sizes: find(/taille|size/i) };
}

const SIZE = '(xxs|xs|s|m|l|xl|xxl|xxxl|3xl)';

/** Vérifie les faits chiffrables d'une proposition contre les vraies données produit.
 *  facts = { colors:[…], sizes:[…] }. Renvoie la liste des faits FAUX (vide = OK). */
export function verifyFacts(text, facts = {}) {
  const out = [];
  const t = (text || '').toLowerCase();
  const colors = facts.colors || [];
  const sizes = (facts.sizes || []).map((s) => String(s).toUpperCase().trim());

  // « N coloris / N couleurs » doit correspondre au nombre réel de couleurs.
  const m = t.match(/(\d+)\s*(coloris|couleurs)/);
  if (m && colors.length && Number(m[1]) !== colors.length) {
    out.push(`nombre de coloris annoncé (${m[1]}) ≠ réel (${colors.length})`);
  }

  // Plage de tailles « S–XXL », « S-XL », « S à XXL » : les deux bornes doivent exister.
  const range =
    t.match(new RegExp(`\\b${SIZE}\\s*[–\\-—]\\s*${SIZE}\\b`, 'i')) ||
    t.match(new RegExp(`\\b${SIZE}\\s+à\\s+${SIZE}\\b`, 'i'));
  if (range && sizes.length) {
    for (const end of [range[1], range[2]]) {
      if (!sizes.includes(end.toUpperCase())) {
        out.push(`taille annoncée « ${end.toUpperCase()} » absente des tailles réelles (${sizes.join('/')})`);
      }
    }
  }
  return out;
}
