// Fonction serveur Vercel — appelle Claude avec le « cerveau » KORE.
// La clé API reste côté serveur (variable d'environnement ANTHROPIC_API_KEY) = sécurisé.

const SYSTEM = `Tu es le conseiller e-commerce / CRO / Compliance de la boutique KORE
(activewear féminin premium, korewear.fr, France, exploitée par Aïcha DIALLO).
Catalogue : leggings (34,90 €), brassières (24,90 €), shorts (24,90 €), jupe-legging (39,90 €),
ensembles (39,90–49,90 €). Livraison offerte (5-10 jours, avec suivi), retours 14 jours.
Tu réponds en FRANÇAIS, franc et en mode red team, priorisé par impact réel sur les ventes
et la confiance. RÈGLES : jamais de faux avis ni fausses allégations ; conformité loi Omnibus
(pas de faux prix barré, pas de fausse urgence) ; ne jamais dire « retours gratuits ».
Réponses courtes, concrètes, actionnables. Rappelle au besoin que le vrai levier de ventes
= le trafic (TikTok) + des photos réelles.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' });
    return;
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY manquante (à définir dans Vercel).' });
    return;
  }
  const model = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const messages = body && Array.isArray(body.messages) ? body.messages : null;
  if (!messages) {
    res.status(400).json({ error: 'Paramètre "messages" requis.' });
    return;
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ model, max_tokens: 1200, system: SYSTEM, messages }),
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({ error: data?.error?.message || 'Erreur API Claude.' });
      return;
    }
    res.status(200).json({ reply: data?.content?.[0]?.text || '(réponse vide)' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
