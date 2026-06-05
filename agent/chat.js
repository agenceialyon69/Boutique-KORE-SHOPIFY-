import readline from 'node:readline';
import { loadConfig, Shopify } from './lib/shopify.js';

/** Chat KORE — conseiller e-commerce IA dans le terminal. Lancer : node chat.js */

const cfg = loadConfig();
if (!cfg.claudeApiKey || /x{4,}/i.test(cfg.claudeApiKey)) {
  console.error('❌ claudeApiKey manquant dans config.json (clé Anthropic "sk-ant-…").');
  process.exit(1);
}
const model = cfg.claudeModel || 'claude-sonnet-4-6';
const shopify = new Shopify(cfg);

const SYSTEM = `Tu es le conseiller e-commerce / CRO / Compliance de la boutique KORE
(activewear féminin premium, korewear.fr, France, exploitée par Aïcha DIALLO).
Tu réponds en FRANÇAIS, franc et red team, priorisé par impact réel sur les ventes et la confiance.
RÈGLES : jamais de faux avis ni fausses allégations ; conformité loi Omnibus (pas de faux prix barré) ;
livraison offerte 5-10 jours ; retours 14 jours (jamais « gratuits »). Réponses courtes, concrètes,
actionnables. Rappelle au besoin que le vrai levier de ventes = trafic (TikTok) + photos réelles.`;

async function claudeChat(messages) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': cfg.claudeApiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ model, max_tokens: 1200, system: SYSTEM, messages }),
  });
  const t = await res.text();
  if (!res.ok) throw new Error(`API Claude ${res.status} : ${t}`);
  return JSON.parse(t).content?.[0]?.text || '(réponse vide)';
}

// Contexte boutique (les produits réels)
const products = await shopify.getAll('products', 'products').catch(() => []);
const ctx = products.length
  ? `Contexte de la boutique : ${products.length} produits — ${products.slice(0, 8).map((p) => p.title).join(' · ')}.`
  : '';

const history = [];
if (ctx) {
  history.push({ role: 'user', content: ctx });
  history.push({ role: 'assistant', content: 'Compris, je connais ta boutique KORE. Pose ta question.' });
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

console.log('\n💬 Chat KORE — ton conseiller e-commerce IA. (tape "exit" pour quitter)\n');
while (true) {
  const q = await ask('Toi : ');
  if (!q.trim()) continue;
  if (q.trim().toLowerCase() === 'exit') break;
  history.push({ role: 'user', content: q });
  try {
    const reply = await claudeChat(history);
    history.push({ role: 'assistant', content: reply });
    console.log(`\nKORE 🖤 : ${reply}\n`);
  } catch (e) {
    console.log(`\n⚠️  ${e.message}\n`);
  }
}
rl.close();
console.log('\nÀ bientôt 👋');
