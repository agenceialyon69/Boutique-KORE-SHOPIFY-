/**
 * Mini-convertisseur Markdown → HTML (sans dépendance).
 * Gère : titres, gras/italique, code, liens, listes, citations, tableaux simples, séparateurs.
 * Suffisant pour publier les pages de la boutique.
 */
export function mdToHtml(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const out = [];
  let inUl = false, inOl = false;

  const closeLists = () => {
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
  };

  const inline = (s) =>
    s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*]+?)\*/g, '$1<em>$2</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, '<a href="$2">$1</a>');

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { closeLists(); continue; }

    let m;
    if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
      closeLists();
      out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`);
    } else if (/^>\s?/.test(line)) {
      closeLists();
      out.push(`<blockquote><p>${inline(line.replace(/^>\s?/, ''))}</p></blockquote>`);
    } else if (/^[-*]\s+/.test(line)) {
      if (!inUl) { closeLists(); out.push('<ul>'); inUl = true; }
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`);
    } else if (/^\d+\.\s+/.test(line)) {
      if (!inOl) { closeLists(); out.push('<ol>'); inOl = true; }
      out.push(`<li>${inline(line.replace(/^\d+\.\s+/, ''))}</li>`);
    } else if (/^\|/.test(line)) {
      // tableau : on ignore la ligne de séparation, sinon on aplatit en paragraphe lisible
      if (/^\|[\s|:-]+\|?$/.test(line)) { continue; }
      closeLists();
      const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
      out.push(`<p>${cells.map(inline).join(' — ')}</p>`);
    } else if (/^---+$/.test(line)) {
      closeLists();
      out.push('<hr>');
    } else {
      closeLists();
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  closeLists();
  return out.join('\n');
}
