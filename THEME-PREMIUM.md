# 🎨 RELOOKING PREMIUM — KORE (tout à copier, une page)

> But : une boutique **plus premium que les concurrents** (qui sont brouillons : prix en $,
> français bancal, générique). Toi = épuré, français impeccable, €, livraison France.
> Honnêteté : **aucune fausse allégation** (pas de "studio Paris", pas de faux avis).

---

## 🎯 La direction (1 ligne)
**Minimalisme premium :** noir & blanc, beaucoup d'espace, typo soignée, une seule
couleur d'accent. Le luxe, c'est ce qu'on enlève, pas ce qu'on ajoute.

## 🎨 Couleurs (à régler dans Personnaliser → Couleurs)
- **Fond :** `#FAF9F7` (blanc cassé / crème = chaleureux et premium)
- **Texte :** `#111111` (presque noir)
- **Boutons / accents :** `#111111` (noir), texte blanc
- **Touche premium (détails, liens) :** `#9E8C72` (taupe doré, optionnel)

## ✍️ Polices (Personnaliser → Typographie)
- **Titres :** une sans-serif moderne et nette — `Jost`, `Archivo` ou `Poppins`
- **Texte courant :** `Inter` ou `Assistant` (lisible, sobre)
- Évite les polices fantaisie : la sobriété = le premium.

---

## 1) Barre d'annonce
```
Livraison offerte · Paiement sécurisé · Expédié sous 5-10 jours
```

## 2) Bannière héro
- **Image :** une photo nette du **legging noir porté** (fond neutre/clair, pas de couple générique)
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

## 3) Barre de réassurance (section HTML / Liquid personnalisé)
```html
<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:28px;padding:24px;text-align:center;font-size:13px;letter-spacing:.03em;color:#111;">
  <div>🚚<br><strong>Livraison offerte</strong><br>partout en France</div>
  <div>🔒<br><strong>Paiement sécurisé</strong><br>CB · Apple/Google Pay</div>
  <div>↩️<br><strong>Retours 14 jours</strong><br>sans justification</div>
  <div>💬<br><strong>Service client</strong><br>réponse sous 24h</div>
</div>
```

## 4) Section marque (« Notre approche » — honnête, premium)
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

## 5) Section avantages (3 colonnes)
| Titre | Texte |
|---|---|
| 🍑 Effet sculptant | Taille haute gainante et couture remontante qui galbe naturellement. |
| 🚫 Sans coutures | Invisible sous les vêtements, zéro frottement, confort total. |
| 💪 Squat-proof | Maille opaque même à l'étirement. Liberté de mouvement 4 sens. |

## 6) Section « produit en vedette »
**Titre :**
```
Le legging signature
```
→ relie cette section à ta fiche legging + bouton **« Ajouter au panier »**.

## 7) FAQ courte (accueil)
```
Reste-t-il opaque ? — Oui, maille squat-proof, opaque même à l'étirement.
Quel délai ? — Livraison offerte, 5 à 10 jours ouvrés, avec suivi.
Et si la taille ne va pas ? — 14 jours pour le retourner.
```

## 8) Footer
**Ligne de réassurance :**
```
Paiement 100% sécurisé · Livraison offerte · Retours 14 jours · contact@korewear.fr
```
**Newsletter (si bloc présent) :**
```
-10% sur ta première commande. Rejoins la communauté KORE.
```

## 9) CSS premium (Personnaliser → CSS perso, ou je l'applique via GitHub)
```css
h1, h2 { letter-spacing: .01em; font-weight: 600; }
.button, button { border-radius: 0; letter-spacing: .05em; text-transform: uppercase; font-size: 13px; }
.product__title, .card__heading { letter-spacing: .02em; }
img { border-radius: 0; }
```
*(Sélecteurs à ajuster selon le thème — je le ferai proprement une fois GitHub relié.)*

## 📐 Ordre des sections (page d'accueil)
1. Barre d'annonce → 2. Héro → 3. Réassurance → 4. Produit en vedette →
5. Avantages → 6. Section marque → 7. FAQ courte → 8. Footer

---

## ⛔ Ce qui te ferait passer pour un dropshipping (à NE PAS faire)
- ❌ Faux avis / faux compteurs « 12 personnes regardent » → illégal + tue la confiance
- ❌ Faux prix barré (loi Omnibus)
- ❌ Prix en `$`, mentions en anglais, horaires US → l'erreur des concurrents
- ❌ Allégations inventées (« studio Paris », « testé 3 semaines ») → mensonge
- ❌ Trop de couleurs, bannières chargées, pop-ups agressifs → cheap

> Ton avantage premium = **sobriété + français impeccable + € + France.** C'est gratuit et
> ça te place direct au-dessus des concurrents brouillons.
