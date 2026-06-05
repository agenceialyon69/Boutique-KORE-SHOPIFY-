import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Agent Prospection CLAIRE — génère une séquence d'outreach par cabinet. Lancer : node index.js */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));

let cfg;
try { cfg = read('config.json'); }
catch { console.error('❌ config.json introuvable → copie config.example.json en config.json et mets ta claudeApiKey.'); process.exit(1); }
if (!cfg.claudeApiKey || /x{4,}/i.test(cfg.claudeApiKey)) { console.error('❌ claudeApiKey manquant dans config.json.'); process.exit(1); }
const model = cfg.claudeModel || 'claude-sonnet-4-6';

let cabinets;
try { cabinets = read('cabinets.json'); }
catch { console.error('❌ cabinets.json introuvable → copie cabinets.example.json en cabinets.json et remplis ta liste.'); process.exit(1); }
if (!Array.isArray(cabinets) || !cabinets.length) { console.error('❌ cabinets.json doit être une liste non vide.'); process.exit(1); }

const SYSTEM = `Tu es l'assistant de prospection de Tafsir, créateur de CLAIRE — un assistant d'accueil
patient par IA pour cabinets dentaires (claireassistante.fr). CLAIRE accueille les patients, qualifie
la demande, récupère les coordonnées et transmet un résumé au cabinet. Jamais de diagnostic ni de prix
médical ; conforme RGPD.
OFFRE : 5 cabinets fondateurs — 89 €/mois pendant 12 mois (puis 149 €), installation offerte,
sans engagement, 14 jours d'essai gratuit.
POSTURE : « avis d'expert, pas vente ». Ton humain, respectueux, court. Tu écoutes, tu proposes de
MONTRER une démo, tu demandes leur avis. Jamais de pression ni de superlatifs creux.
RÈGLES STRICTES :
- Prospection B2B vers des pros → objet clair + une phrase de désinscription possible.
- JAMAIS de fausse référence : Tafsir n'a pas encore de clients → n'écris JAMAIS « des cabinets nous
  font confiance ». Mise sur l'offre fondateur + l'essai gratuit + l'avis d'expert.
- Personnalise avec le nom du cabinet et la ville. Français impeccable, sobre, crédible.
Réponds UNIQUEMENT en JSON :
{"objet":"…","email_intro":"…","relance_1":"…","relance_2":"…","script_appel":"…"}`;

async function claude(user) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': cfg.claudeApiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: 1500, system: SYSTEM, messages: [{ role: 'user', content: user }] }),
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`API Claude ${r.status} : ${t}`);
  const raw = JSON.parse(t).content?.[0]?.text || '';
  const s = raw.indexOf('{'), e = raw.lastIndexOf('}');
  if (s === -1) throw new Error('Réponse sans JSON.');
  return JSON.parse(raw.slice(s, e + 1));
}

const outDir = path.join(__dirname, 'messages');
fs.mkdirSync(outDir, { recursive: true });

console.log(`\n📨 Agent Prospection CLAIRE — ${cabinets.length} cabinet(s) (modèle : ${model}).\n`);
for (const c of cabinets) {
  const user = `Cabinet : ${c.nom}\nVille : ${c.ville || '(non précisée)'}\nEmail : ${c.email || '(non précisé)'}\n\nGénère la séquence d'outreach personnalisée. JSON uniquement.`;
  try {
    const out = await claude(user);
    const md =
      `# ${c.nom} — ${c.ville || ''}\n**Email :** ${c.email || ''}\n\n` +
      `## Objet\n${out.objet}\n\n## Email d'introduction\n${out.email_intro}\n\n` +
      `## Relance 1\n${out.relance_1}\n\n## Relance 2\n${out.relance_2}\n\n## Script d'appel\n${out.script_appel}\n`;
    const file = path.join(outDir, ((c.nom || 'cabinet').replace(/[^a-z0-9]+/gi, '-').toLowerCase()) + '.md');
    fs.writeFileSync(file, md, 'utf8');
    console.log(`✅ ${c.nom} → messages/${path.basename(file)}`);
  } catch (e) {
    console.log(`⚠️  ${c.nom} — ${e.message}`);
  }
}
console.log(`\n✅ Terminé. Relis les fichiers du dossier "messages/", PUIS envoie-les toi-même (validation humaine, jamais d'envoi auto).`);
