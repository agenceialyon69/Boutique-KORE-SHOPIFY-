import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_VERSION = '2024-10';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isPlaceholder = (v) => !v || /x{4,}/i.test(v) || v.trim() === '';

export function loadConfig() {
  const p = path.join(__dirname, '..', 'config.json');
  if (!fs.existsSync(p)) {
    throw new Error(
      'config.json introuvable.\n   → Copie "config.example.json" en "config.json" et remplis-le.'
    );
  }
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
  const hasToken = !isPlaceholder(cfg.token);
  const hasOAuth = !isPlaceholder(cfg.clientId) && !isPlaceholder(cfg.clientSecret);
  if (!cfg.shop || (!hasToken && !hasOAuth)) {
    throw new Error(
      'config.json incomplet.\n   → Renseigne "shop" + SOIT "token" (shpat_…),\n      SOIT "clientId" ET "clientSecret".'
    );
  }
  cfg.brand = cfg.brand || 'KORE';
  return cfg;
}

export class Shopify {
  constructor(cfg) {
    let shop = cfg.shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!shop.includes('.myshopify.com')) shop = `${shop}.myshopify.com`;
    this.shop = shop;
    this.base = `https://${this.shop}/admin/api/${API_VERSION}/`;

    this.staticToken = isPlaceholder(cfg.token) ? null : cfg.token;
    this.clientId = isPlaceholder(cfg.clientId) ? null : cfg.clientId;
    this.clientSecret = isPlaceholder(cfg.clientSecret) ? null : cfg.clientSecret;

    this._token = null;
    this._tokenExp = 0;
  }

  /** Renvoie un jeton valide (statique shpat_ OU obtenu via client_credentials). */
  async getToken() {
    if (this.staticToken) return this.staticToken;
    if (this._token && Date.now() < this._tokenExp - 60_000) return this._token;

    const res = await fetch(`https://${this.shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(
        `Échec d'obtention du jeton (${res.status}).\n   ${text}\n` +
        '   → Vérifie clientId / clientSecret, et que l\'app est bien installée sur la boutique.'
      );
    }
    const json = JSON.parse(text);
    this._token = json.access_token;
    this._tokenExp = Date.now() + (json.expires_in || 3600) * 1000;
    return this._token;
  }

  async rest(method, endpoint, body) {
    const accessToken = await this.getToken();
    const res = await fetch(this.base + endpoint, {
      method,
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let json;
    try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
    if (res.status === 429) {
      await sleep(2000);
      return this.rest(method, endpoint, body);
    }
    if (!res.ok) {
      throw new Error(`Shopify ${method} ${endpoint} → ${res.status} ${res.statusText}\n   ${text}`);
    }
    if (method !== 'GET') await sleep(550);
    return { json, headers: res.headers };
  }

  /** Récupère TOUS les éléments d'une ressource paginée (Link header). */
  async getAll(resource, key, params = '') {
    let endpoint = `${resource}.json?limit=250${params ? '&' + params : ''}`;
    const items = [];
    while (endpoint) {
      const { json, headers } = await this.rest('GET', endpoint);
      items.push(...(json[key] || []));
      const next = parseNextLink(headers.get('link'));
      endpoint = next ? next.replace(this.base, '') : null;
    }
    return items;
  }
}

function parseNextLink(link) {
  if (!link) return null;
  for (const part of link.split(',')) {
    const m = part.match(/<([^>]+)>;\s*rel="next"/);
    if (m) return m[1];
  }
  return null;
}
