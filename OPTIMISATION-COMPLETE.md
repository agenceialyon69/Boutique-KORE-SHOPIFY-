# 🏆 OPTIMISATION COMPLÈTE — KORE (1 page, tout à configurer)

> Objectif : une boutique **propre, premium, cohérente** → devant 95 % des petites boutiques
> (qui sont brouillonnes). Honnêteté totale : zéro faux avis, zéro fausse allégation.
> Marque : KORE · korewear.fr · € · livraison offerte 5-10 j · contact@korewear.fr

---

## 0) RÈGLE D'OR
**Le premium, c'est la sobriété.** Une seule famille de couleurs, 1-2 polices, beaucoup
d'espace, une seule action par écran. Moins = mieux.

---

## 1) RÉGLAGES GLOBAUX (Personnaliser → Réglages du thème)

### Couleurs
- **Fond :** `#FAF9F7` (blanc cassé chaud)
- **Texte :** `#111111`
- **Boutons :** fond `#111111`, texte `#FFFFFF`
- **Accent / liens :** `#9E8C72` (taupe doré)
- **Bordures :** `#E7E3DD`

### Typographie
- **Titres :** `Jost` ou `Archivo` (sans-serif moderne)
- **Texte :** `Assistant` ou `Work Sans`
- **Taille de base :** 16px · **Titres** : bien contrastés, pas énormes

### Style
- **Coins des boutons / images :** carrés (rayon 0) = plus premium
- **Espacement des sections :** large (laisse respirer)

---

## 2) BARRE D'ANNONCE
```
Livraison offerte · Paiement sécurisé · Expédié sous 5-10 jours
```
- Fond noir `#111`, texte blanc, petite taille, centré.

---

## 3) EN-TÊTE (Header)
- **Logo :** « KORE » texte épuré (ou logo simple noir). Centré ou à gauche.
- **Menu :** `Accueil · Boutique · À propos · Contact` (court, pas surchargé)
- **Devise :** EUR €
- **Icônes :** recherche, compte, panier (gardées simples)

---

## 4) BANNIÈRE HÉRO ⭐ (le plus important)
- **Image :** photo du **legging noir porté**, fond clair/neutre (PAS de couple générique)
- **Superposition (overlay) :** 15-25 % sombre pour la lisibilité du texte
- **Titre :**
```
Un legging qui te tient, du tapis à la rue.
```
- **Sous-titre :**
```
Taille haute · sans coutures · effet sculptant.
```
- **Bouton :**
```
Découvrir le legging
```
(lien → fiche produit)

---

## 5) BARRE DE RÉASSURANCE (section HTML / Liquid perso, sous le héro)
```html
<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:28px;padding:24px;text-align:center;font-size:13px;letter-spacing:.03em;color:#111;">
  <div>🚚<br><strong>Livraison offerte</strong><br>partout en France</div>
  <div>🔒<br><strong>Paiement sécurisé</strong><br>CB · Apple/Google Pay</div>
  <div>↩️<br><strong>Retours 14 jours</strong><br>sans justification</div>
  <div>💬<br><strong>Service client</strong><br>réponse sous 24h</div>
</div>
```

---

## 6) PRODUIT EN VEDETTE
**Titre de section :**
```
Le legging signature
```
- Relie à ta fiche legging · bouton **« Ajouter au panier »** visible.

---

## 7) SECTION AVANTAGES (3 colonnes / icônes)
| Titre | Texte |
|---|---|
| 🍑 Effet sculptant | Taille haute gainante et couture remontante qui galbe naturellement. |
| 🚫 Sans coutures | Invisible sous les vêtements, zéro frottement, confort total. |
| 💪 Squat-proof | Maille opaque même à l'étirement. Liberté de mouvement 4 sens. |

---

## 8) SECTION MARQUE (honnête, premium)
**Titre :**
```
L'essentiel, en mouvement.
```
**Texte :**
```
KORE, ce sont des pièces activewear pensées pour galber, tenir et durer — sans esbroufe.
Le confort qui te suit du studio au quotidien, dans une matière qui ne te lâche pas.
Moins de promesses, plus de tenue.
```

---

## 9) FAQ COURTE (accueil)
```
Reste-t-il opaque ? — Oui, maille squat-proof, opaque même à l'étirement.
Quel délai de livraison ? — Livraison offerte, 5 à 10 jours ouvrés, avec suivi.
Et si la taille ne va pas ? — 14 jours pour le retourner, sans justification.
```

---

## 10) NEWSLETTER (si bloc présent)
**Titre :**
```
Rejoins la communauté KORE
```
**Texte :**
```
-10% sur ta première commande, et les nouveautés en avant-première.
```
*(N'active la promo -10% que si tu crées vraiment le code de réduction.)*

---

## 11) FOOTER
**Ligne de réassurance :**
```
Paiement 100% sécurisé · Livraison offerte · Retours 14 jours · contact@korewear.fr
```
**Liens (déjà faits) :** Mentions légales · CGV · Confidentialité · Livraison & Retours · À propos · Contact · FAQ

---

## 12) FICHE PRODUIT (rappel premium)
- 3-5 **images propres** (sans filigrane), même format, fond cohérent
- Titre clair + bénéfice · prix net 34,90 € · sélecteur de tailles
- Description + guide des tailles + réassurance (déjà collés)
- Bouton **Ajouter au panier** bien visible

---

## 13) ORDRE DES SECTIONS (page d'accueil)
1. Barre d'annonce → 2. Héro → 3. Réassurance → 4. Produit vedette →
5. Avantages → 6. Marque → 7. FAQ → 8. Newsletter → 9. Footer

---

## 14) MOBILE (80 % de ton trafic TikTok)
- Vérifie que **titres non coupés**, boutons larges, images nettes
- **Bouton « Ajouter au panier » collant** en bas sur mobile (si l'option existe)
- Teste le parcours achat sur ton tel de bout en bout

---

## 15) VITESSE
- **Compresse les images** (≤ 200-300 Ko) avant upload
- Pas d'apps inutiles · pas de pop-up agressif

---

## 16) CSS PREMIUM (si champ CSS dispo)
```css
h1, h2 { letter-spacing:.01em; font-weight:600; }
.button, button { border-radius:0; letter-spacing:.05em; text-transform:uppercase; font-size:13px; }
img { border-radius:0; }
.card__heading, .product__title { letter-spacing:.02em; }
```

---

## ⛔ À NE JAMAIS FAIRE (red team)
- ❌ Faux avis / faux « 12 personnes regardent »
- ❌ Faux prix barré (loi Omnibus)
- ❌ Prix en `$`, textes en anglais, horaires US
- ❌ Allégations inventées (« studio Paris », « testé 3 semaines »)
- ❌ Trop de couleurs, bannières chargées, pop-ups
- ❌ Images à filigrane

---

## ✅ CHECKLIST FINALE
- [ ] Couleurs + polices réglées
- [ ] Barre d'annonce
- [ ] **Image héro = legging noir** (le geste n°1)
- [ ] Réassurance + Avantages + Marque + FAQ
- [ ] Footer complet
- [ ] Images produit propres + compressées
- [ ] Test mobile complet
- [ ] **PUIS : 1ʳᵉ vidéo TikTok** (le trafic = les ventes)

> 🧠 Rappel : ce design te met **devant 95 % des petites boutiques**. Mais une belle boutique
> sans visiteurs vend 0. Le design = la crédibilité. **TikTok = les ventes.** Les deux comptent.
