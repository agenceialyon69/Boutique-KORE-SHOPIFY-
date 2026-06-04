import { askClaude } from '../lib/claude.js';

/**
 * analyze-theme : LECTURE SEULE. Lit le thème publié, analyse la page d'accueil,
 * et demande à Claude un PLAN d'amélioration. N'APPLIQUE JAMAIS (sécurité).
 * Nécessite le scope "read_themes" sur l'app.
 */
const SYSTEM = `Tu es le Head of Ecommerce + CRO de KORE (activewear féminin, France).
On te donne la structure de la page d'accueil d'un thème Shopify. Produis un PLAN d'amélioration
priorisé par IMPACT sur la conversion. Pour CHAQUE recommandation, indique : section concernée,
action, KPI visé, impact (faible/moyen/élevé), risque, et qui l'exécute (toi en customizer / agent).
Respecte : photos réelles > design, avis réels > faux, clarté > créativité, pas de fausses allégations,
pas de prix barré. NE PROPOSE PAS de code à appliquer automatiquement — seulement un plan + instructions
claires à valider à la main. Réponds en texte clair et structuré (pas de JSON).`;

export default async function analyzeTheme({ shopify, cfg }) {
  if (!cfg.claudeApiKey || /x{4,}/i.test(cfg.claudeApiKey)) throw new Error('claudeApiKey manquant.');
  const model = cfg.claudeModel || 'claude-sonnet-4-6';

  // 1) thème publié
  const { json: themesJson } = await shopify.rest('GET', 'themes.json');
  const main = (themesJson.themes || []).find((t) => t.role === 'main');
  if (!main) throw new Error('Thème publié introuvable. (Scope "read_themes" requis ?)');
  console.log(`🎨 Thème publié : ${main.name} (id ${main.id})\n`);

  // 2) template de la page d'accueil
  let indexContent = '(introuvable)';
  try {
    const { json } = await shopify.rest('GET', `themes/${main.id}/assets.json?asset[key]=templates/index.json`);
    indexContent = json.asset?.value || indexContent;
  } catch {
    console.log('⚠️  Impossible de lire templates/index.json (scope read_themes manquant ?). Analyse limitée.');
  }

  // 3) plan par Claude (lecture seule)
  const user =
    `Thème : ${main.name}\nStructure de la page d'accueil (templates/index.json) :\n` +
    `${indexContent.slice(0, 6000)}\n\nProduis le PLAN d'amélioration priorisé.`;
  const plan = await askClaude({ apiKey: cfg.claudeApiKey, model, system: SYSTEM, user, maxTokens: 2500 });

  console.log('================ PLAN PROPOSÉ (à valider à la main) ================\n');
  console.log(plan);
  console.log('\n===================================================================');
  console.log('⚠️  LECTURE SEULE : aucune modification appliquée. Valide puis applique au customizer.');
}
