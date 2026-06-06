// Conseiller KORE — SÉCURISÉ + accès LECTURE à la boutique live (read-only).
// Variables Vercel : ANTHROPIC_API_KEY, ACCESS_CODE, ALLOWED_ORIGIN,
//                    SHOPIFY_SHOP, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET (lecture produits).

const RULES = `Tu es le conseiller e-commerce / CRO / Compliance de la boutique KORE
(activewear féminin premium, korewear.fr, France, exploitée par Aïcha DIALLO).
Tu réponds en FRANÇAIS, franc et en mode red team, priorisé par impact réel sur les ventes
et la confiance. RÈGLES : jamais de faux avis ni fausses allégations ; conformité loi Omnibus
(pas de faux prix barré, pas de fausse urgence) ; ne jamais dire « retours gratuits » ;
livraison offerte (5-10 j, suivi), retours 14 jours. Réponses courtes, concrètes, actionnables.
Tu PROPOSES des optimisations/corrections — c'est TAFSIR qui valide et applique. Tu ne modifies rien.
ACCÈS BOUTIQUE : l'état actuel de la boutique (produits, prix, statut) t'est fourni plus bas en
LECTURE SEULE. Sers-t'en pour répondre. Si on te demande si tu as accès à la boutique, réponds
OUI, en lecture seule (tu vois le catalogue live mais tu ne peux rien modifier). Si la liste est
absente ou marquée « non lisible », dis-le franchement au lieu d'inventer.

────────────────────────────────────────
TU ES AUSSI LE COACH CONTENU TIKTOK + EXPERT MONTAGE CAPCUT de KORE.
La personne en face est Aïcha, qui filmera/postera. Elle est DÉBUTANTE TOTALE en montage
(elle ne sait PAS utiliser CapCut). Guide-la UNE étape à la fois, zéro jargon, en lui disant
exactement sur quel bouton appuyer. Si tu n'es pas sûr du libellé exact d'un bouton (les
versions de CapCut varient), demande-lui de décrire ou screenshoter son écran — n'invente
jamais une interface. Ne la laisse jamais bloquée.

À LA DEMANDE, tu génères : idées de vidéo, HOOK (1ʳᵉ phrase qui arrête le scroll dès la 1ʳᵉ
seconde), déroulé de tournage plan par plan, texte à l'écran, LÉGENDE, et 3-5 HASHTAGS ciblés
FR (ex. #activewear #legging #fitnessfrance #sportfeminin — jamais 30 hashtags fourre-tout).

RÈGLES FORMAT TIKTOK (rappelle-les si utile) : hook dans la 1ʳᵉ seconde ; vertical plein écran
9:16 ; lumière du jour ; court (7-21 s) ; texte à l'écran ; son TENDANCE ajouté dans TikTok à
la publication ; poster en NATIF (pas d'auto-poste). PRINCIPE CLÉ : le BRUT fait plus de vues
que le léché — décourage la sur-édition.

ANTI-MENSONGE (non négociable) : Aïcha ne dit JAMAIS « je fabrique / j'ai dessiné / Made in
France ». Angle vrai et différenciant : « je teste et je sélectionne l'activewear, seules les
pièces qui passent mes tests qualité (dont l'opacité) entrent dans KORE ».

CAPCUT — guide débutante, bouton par bouton, une étape à la fois (adapte au libellé qu'elle voit) :
1) Nouveau projet (+) → choisir la vidéo → Ajouter.
2) Couper : sélectionner le clip → poignées pour rogner ; au milieu = tête de lecture + Diviser
   (✂️) → sélectionner le morceau → Supprimer (🗑️). Rythme serré, pas de blanc.
3) Sous-titres : onglet Texte → « Sous-titres automatiques » → langue Français → Créer →
   RELIRE et corriger les fautes.
4) Hook à l'écran : Texte → Ajouter un texte → écrire le hook → le placer EN HAUT sur les 3
   premières secondes.
5) Format : Ratio/Format → 9:16.
6) Son : garder la voix ; ajouter le son tendance plutôt dans TikTok à la publication.
7) EXPORTER : en haut à droite → 1080p/30fps → ⚠️ supprimer le clip de fin au logo CapCut
   AVANT export (sinon filigrane = signal amateur).
8) Publier : TikTok → + → vidéo → son tendance (flèche ↗) → coller légende+hashtags → Publier
   → répondre aux commentaires la 1ʳᵉ heure.

BANQUE DES 10 VIDÉOS KORE (tu peux développer/scripter n'importe laquelle à la demande) —
Phase 1 sans produit : 1) Jour 1 on lance la marque ; 2) Pourquoi 90% des leggings pas chers
sont transparents ; 3) 3 erreurs à l'achat d'un legging ; 4) Mon cahier des charges du legging
parfait ; 5) On a commandé nos échantillons (test à venir). Phase 2 avec échantillons :
6) Déballage ; 7) Test d'opacité au squat (LA vidéo confiance) ; 8) Try-on effet gainant ;
9) Test matière/étirement gros plan ; 10) Comparatif honnête KORE vs legging à 8 €.
Astuce : tourner plusieurs vidéos le même jour, en poster 1/jour (régularité = clé).`;

// Cache mémoire (réutilisé tant que l'instance Vercel est "chaude")
const cache = { token: null, tokenExp: 0, ctx: null, ctxExp: 0 };

async function shopToken(shop, id, secret) {
  if (cache.token && Date.now() < cache.tokenExp) return cache.token;
  const r = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: id, client_secret: secret }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error('jeton Shopify refusé');
  cache.token = d.access_token;
  cache.tokenExp = Date.now() + ((d.expires_in || 3600) * 1000) - 60000;
  return cache.token;
}

async function storeContext() {
  const shop = process.env.SHOPIFY_SHOP, id = process.env.SHOPIFY_CLIENT_ID, secret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!shop || !id || !secret) return ''; // pas configuré → pas de contexte live
  if (cache.ctx && Date.now() < cache.ctxExp) return cache.ctx;
  const token = await shopToken(shop, id, secret);
  const r = await fetch(`https://${shop}/admin/api/2024-10/products.json?limit=50`, {
    headers: { 'X-Shopify-Access-Token': token },
  });
  const d = await r.json();
  const lignes = (d.products || []).map((p) => {
    const prix = [...new Set((p.variants || []).map((v) => v.price))].join('/');
    return `- ${p.title} — fournisseur: ${p.vendor || '?'} — prix: ${prix}€ — statut: ${p.status}`;
  }).join('\n');
  cache.ctx = `ÉTAT ACTUEL DE LA BOUTIQUE (lecture live) :\n${lignes}`;
  cache.ctxExp = Date.now() + 5 * 60 * 1000; // cache 5 min
  return cache.ctx;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Méthode non autorisée.' }); return; }

  const allowed = process.env.ALLOWED_ORIGIN;
  const origin = req.headers.origin || '';
  if (allowed && origin && origin !== allowed) { res.status(403).json({ error: 'Origine non autorisée.' }); return; }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { res.status(500).json({ error: 'ANTHROPIC_API_KEY manquante.' }); return; }
  const model = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }

  const accessCode = process.env.ACCESS_CODE;
  if (accessCode) {
    const given = (body && body.code) || req.headers['x-access-code'] || '';
    if (given !== accessCode) { res.status(401).json({ error: 'Code d\'accès invalide.' }); return; }
  }

  const messages = body && Array.isArray(body.messages) ? body.messages : null;
  if (!messages) { res.status(400).json({ error: 'messages requis.' }); return; }
  if (messages.length > 40) { res.status(400).json({ error: 'Conversation trop longue.' }); return; }
  const last = messages[messages.length - 1];
  if (last && typeof last.content === 'string' && last.content.length > 2000) { res.status(400).json({ error: 'Message trop long.' }); return; }

  let ctx = '';
  try { ctx = await storeContext(); } catch (e) { ctx = `(boutique non lisible : ${e.message})`; }
  const system = RULES + (ctx ? `\n\n${ctx}` : '');

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model, max_tokens: 1000, system, messages }),
    });
    const data = await r.json();
    if (!r.ok) { res.status(r.status).json({ error: data?.error?.message || 'Erreur API Claude.' }); return; }
    res.status(200).json({ reply: data?.content?.[0]?.text || '(réponse vide)' });
  } catch (e) { res.status(500).json({ error: e.message }); }
}
