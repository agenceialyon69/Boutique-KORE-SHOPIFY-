/** Appel simple à l'API Claude (Anthropic). Clé dans config.json → "claudeApiKey". */
export async function askClaude({ apiKey, model, system, user, maxTokens = 1800 }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `API Claude ${res.status} : ${text}\n` +
      '   → Vérifie "claudeApiKey" dans config.json (clé Anthropic) et ton crédit API.'
    );
  }
  const json = JSON.parse(text);
  return json.content?.[0]?.text || '';
}

/** Extrait le 1er bloc JSON d'une réponse (tolère ```json … ```). */
export function parseJson(raw) {
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Pas de JSON dans la réponse.');
  return JSON.parse(cleaned.slice(start, end + 1));
}
