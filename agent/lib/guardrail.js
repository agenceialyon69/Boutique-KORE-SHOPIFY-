/** Garde-fou conformité : bloque toute proposition contenant une formulation interdite.
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
];

/** Renvoie la liste des problèmes trouvés dans les textes donnés (vide = OK). */
export function violations(...texts) {
  const t = texts.filter(Boolean).join('  ');
  return INTERDITS.filter((f) => f.re.test(t)).map((f) => f.label);
}
