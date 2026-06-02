# 🚀 MISE EN LIGNE — KORE (tout au même endroit)

> **But :** un seul fichier à suivre, dans l'ordre, pour passer la boutique de « préparée »
> à « EN LIGNE ». Pensé pour être fait sur **ordinateur** (le mobile est trop pénible),
> par **Aïcha** (c'est sa boutique) ou Tafsir.
>
> ⚠️ Rappel : ce dépôt = préparation. Rien n'est en ligne tant que ce n'est pas **collé +
> publié dans Shopify**.

---

## 🎯 Ordre critique (ne fais que ça, ignore le reste)

1. **💳 Paiement** — sans ça, 0 vente possible
2. **📄 Pages légales + footer** — confiance + conformité
3. **🎨 Thème (3 textes clés)** — bannière + réassurance
4. **📱 1ʳᵉ vidéo TikTok** — le trafic (rôle d'Aïcha, ~15 min/jour)

Tout le reste (couleurs parfaites, sections avancées) = **plus tard ou jamais.**

---

## ÉTAPE 1 — 💳 Activer le paiement (avec Aïcha)
**Paramètres → Paiements → Activer Shopify Payments**, remplir :
- Type : **micro-entreprise** · Nom : **Aïcha DIALLO** · SIRET **98975496500014**
- Adresse : **16 avenue d'Oschatz, 69200 Vénissieux**
- Identité du titulaire : **Aïcha** (+ pièce d'identité si demandée)
- **IBAN** au nom d'Aïcha (compte qui reçoit l'argent)
- (Optionnel) Ajouter **PayPal** pour rassurer

✅ Validé = la boutique peut encaisser.

---

## ÉTAPE 2 — 📄 Pages légales + footer
**Boutique en ligne → Pages → Ajouter une page** (pour chacune : Titre → bouton `<>` →
coller le HTML → Enregistrer). Le contenu est prêt dans le dossier `pages-legales/` et
`contenu/` :

| Page | Source |
|---|---|
| Mentions légales | `pages-legales/mentions-legales.md` |
| Conditions Générales de Vente | `pages-legales/conditions-generales-de-vente.md` |
| Politique de confidentialité | `pages-legales/politique-de-confidentialite.md` |
| Livraison & Retours | `pages-legales/livraison-et-retours.md` |
| À propos | `contenu/page-a-propos.md` |
| Contact | `contenu/page-contact.md` |
| FAQ | `contenu/faq.md` |

Puis **Navigation → menu « Pied de page »** → ajouter un lien vers chacune → Enregistrer.

⏳ Reste à faire (non bloquant) : adhérer à un **médiateur** (CM2C/Medicys ~30 €/an) et
mettre son nom dans les mentions légales.

---

## ÉTAPE 3 — 🎨 Thème (Personnaliser, sur PC)

### Barre d'annonce (haut du site)
```
🚚 Livraison OFFERTE · Paiement sécurisé · Expédié sous 5-10 jours
```

### Bannière principale
- **Image :** une photo du **legging noir porté** (pas le couple générique actuel)
- **Titre :**
```
Le legging qui te galbe et ne te lâche jamais
```
- **Sous-titre :**
```
Taille haute · sans coutures · effet sculptant. Pensé pour le mouvement.
```
- **Bouton :** `Découvrir le legging` → lien vers la fiche produit

### Barre de réassurance (section HTML/Liquid personnalisé)
```html
<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:24px;padding:20px;text-align:center;font-size:14px;">
  <div>🚚<br><strong>Livraison offerte</strong><br>partout en France</div>
  <div>🔒<br><strong>Paiement sécurisé</strong><br>CB · Apple/Google Pay</div>
  <div>↩️<br><strong>Retours 14 jours</strong><br>sans justification</div>
  <div>💬<br><strong>Service client</strong><br>réponse sous 24h</div>
</div>
```

### Footer (bloc texte)
```
Paiement 100% sécurisé · Livraison offerte · Retours 14 jours · contact@korewear.fr
```

### Réglages visuels
- Fond blanc cassé `#FAFAF8` · Texte noir `#1A1A1A` · Boutons **noirs** texte blanc
- Beaucoup d'espace blanc = look premium

---

## ÉTAPE 4 — 📱 TikTok (rôle d'Aïcha, ~15 min/jour)
Filmer au téléphone, vertical 9:16, lumière du jour. 1 vidéo/jour. Lien boutique en bio.
1. **Le test squat** : enfiler le legging, 3 squats → « Toujours opaque ? ✅ »
2. **Effet taille haute** : avant/après, focus galbe + maintien, son tendance
3. **Pourquoi seamless** : gros plan « on ne voit pas les coutures sous un vêtement moulant »

---

## 🤝 Passage de relais à Aïcha
Tafsir a fait le montage technique. **Aïcha pilote ensuite** : poster les vidéos + répondre
aux clients (contact@korewear.fr). C'est SA boutique → temps + responsabilité côté Aïcha.
Tafsir garde son énergie pour **Claire**.

---

## 🛠️ (Optionnel) Pour que Claude optimise le thème EN CODE
Si vous voulez que l'optimisation du thème soit faite automatiquement (au lieu du
customizer manuel), sur PC :
```
npm install -g @shopify/cli@latest
shopify theme pull --store hbv1uj-b9.myshopify.com
git add . && git commit -m "theme" && git push
```
→ Claude édite le thème dans le dépôt → puis :
```
git pull
shopify theme push
```
