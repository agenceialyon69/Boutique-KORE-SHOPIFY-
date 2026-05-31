import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mdToHtml } from '../lib/markdown.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..'); // racine du dépôt

const PAGES = [
  { title: 'Mentions légales', handle: 'mentions-legales', file: 'pages-legales/mentions-legales.md' },
  { title: 'Conditions générales de vente', handle: 'cgv', file: 'pages-legales/conditions-generales-de-vente.md' },
  { title: 'Politique de confidentialité', handle: 'politique-de-confidentialite', file: 'pages-legales/politique-de-confidentialite.md' },
  { title: 'Livraison & retours', handle: 'livraison-et-retours', file: 'pages-legales/livraison-et-retours.md' },
  { title: 'Notre histoire', handle: 'notre-histoire', file: 'contenu/page-a-propos.md' },
  { title: 'FAQ', handle: 'faq', file: 'contenu/faq.md' },
  { title: 'Contact', handle: 'contact-infos', file: 'contenu/page-contact.md' },
];

/** Retire les notes internes (destinées à toi, pas aux clients). */
function cleanForPublish(md) {
  return md
    .split('\n')
    .filter((l) => {
      const t = l.trim();
      if (/^>\s*[⚠️💡]/.test(t)) return false;        // notes en citation
      if (/Modèle à compléter/i.test(t)) return false;
      if (/voir\s+`?guide\//i.test(t)) return false;
      if (/Comment l'utiliser|À coller dans|Colle dans|à coller/i.test(t)) return false;
      return true;
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Crée (ou met à jour) les pages de la boutique à partir des fichiers Markdown. */
export default async function createPages({ shopify, apply }) {
  const existing = await shopify.getAll('pages', 'pages');

  for (const def of PAGES) {
    const fp = path.join(ROOT, def.file);
    if (!fs.existsSync(fp)) {
      console.log(`⏭️  Fichier manquant : ${def.file}`);
      continue;
    }
    const md = cleanForPublish(fs.readFileSync(fp, 'utf8'));
    const body_html = mdToHtml(md);
    const found = existing.find((p) => p.handle === def.handle || p.title === def.title);

    console.log(`• ${def.title}  ${found ? '(existe → mise à jour)' : '(création)'}`);

    if (apply) {
      if (found) {
        await shopify.rest('PUT', `pages/${found.id}.json`, { page: { id: found.id, body_html } });
      } else {
        await shopify.rest('POST', 'pages.json', { page: { title: def.title, handle: def.handle, body_html } });
      }
    }
  }
  console.log(`\n${apply ? 'Pages créées/mises à jour ✍️' : 'Simulation terminée'}.`);
  console.log('⚠️  IMPORTANT : remplis les [À COMPLÉTER] (SIRET, email…) AVANT de publier ces pages.');
  console.log('💡 Pense à ajouter ces pages au menu de pied de page (Navigation → Footer).');
}
