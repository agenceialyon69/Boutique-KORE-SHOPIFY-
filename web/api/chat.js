// Fonction Vercel SÉCURISÉE — code d'accès + même origine + limites anti-abus.

const SYSTEM = `Tu es le conseiller e-commerce / CRO / Compliance de la boutique KORE
(activewear féminin premium, korewear.fr, France, exploitée par Aïcha DIALLO).
Catalogue : leggings (34,90 €), brassières (24,90 €), shorts (24,90 €), jupe-legging (39,90 €),
ensembles (39,90–49,90 €). Livraison offerte (5-10 jours, suivi), retours 14 jours.
Tu réponds en FRANÇAIS, franc et red team, priorisé par impact réel sur les ventes et la confiance.
RÈGLES : jamais de faux avis ni fausses allégations ; conformité loi Omnibus (pas de faux prix barré) ;
ne jamais dire « retours gratuits ». Réponses courtes, concrètes, actionnables.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Méthode non autorisée.' }); return; }

  // 1) MÊME ORIGINE — bloque les appels venant d'autres sites
  const allowed = process.env.ALLOWED_ORIGIN; // ex : https://agent-kore.vercel.app
  const origin = req.headers.origin || '';
  if (allowed && origin && origin !== allowed) { res.status(403).json({ error: 'Origine non autorisée.' }); return; }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { res.status(500).json({ error: 'ANTHROPIC_API_KEY manquante.' }); return; }
  const model = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }

  // 2) CODE D'ACCÈS — protège ton portefeuille (défini dans Vercel : ACCESS_CODE)
  const accessCode = process.env.ACCESS_CODE;
  if (accessCode) {
    const given = (body && body.code) || req.headers['x-access-code'] || '';
    if (given !== accessCode) { res.status(401).json({ error: 'Code d\'accès invalide.' }); return; }
  }

  const messages = body && Array.isArray(body.messages) ? body.messages : null;
  if (!messages) { res.status(400).json({ error: 'messages requis.' }); return; }

  // 3) GARDE-FOUS anti-abus
  if (messages.length > 40) { res.status(400).json({ error: 'Conversation trop longue.' }); return; }
  const last = messages[messages.length - 1];
  if (last && typeof last.content === 'string' && last.content.length > 2000) {
    res.status(400).json({ error: 'Message trop long.' }); return;
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model, max_tokens: 1000, system: SYSTEM, messages }),
    });
    const data = await r.json();
    if (!r.ok) { res.status(r.status).json({ error: data?.error?.message || 'Erreur API Claude.' }); return; }
    res.status(200).json({ reply: data?.content?.[0]?.text || '(réponse vide)' });
  } catch (e) { res.status(500).json({ error: e.message }); }
}
