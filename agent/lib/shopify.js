import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_VERSION = '2024-10';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function loadConfig() {
  const p = path.join(__dirname, '..', 'config.json');
  if (!fs.existsSync(p)) {
    throw new Error(
      'config.json introuvable.\n   → Copie "config.example.json" en "config.json" et remplis "shop" + "token".'
    );
  }
  const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!cfg.shop || !cfg.token || cfg.token.includes('xxxx')) {
    throw new Error('config.json : "shop" et "token" sont obligatoires (et le token ne doit pas contenir "xxxx").');
  }
  cfg.brand = cfg.brand || 'KORE';
  return cfg;
}

export class Shopify {
  constructor(cfg) {
    this.shop = cfg.shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
    this.token = cfg.token;
    this.base = `https://${this.shop}/admin/api/${API_VERSION}/`;
  }

  async rest(method, endpoint, body) {
    const res = await fetch(this.base + endpoint, {
      method,
      headers: {
        'X-Shopify-Access-Token': this.token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let json;
    try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
    if (res.status === 429) {
      // dépassement de quota : on patiente et on réessaie une fois
      await sleep(2000);
      return this.rest(method, endpoint, body);
    }
    if (!res.ok) {
      throw new Error(`Shopify ${method} ${endpoint} → ${res.status} ${res.statusText}\n   ${text}`);
    }
    // throttle doux pour les écritures (limite Shopify ~2 req/s)
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
