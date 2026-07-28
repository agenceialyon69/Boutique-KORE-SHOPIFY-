# 📊 PROGRESS — Boutique KORE

> Tableau de bord vivant. Mis à jour à chaque session par Claude.
> Dernière mise à jour : 2026-07-28 (accès Shopify MCP live confirmé — vérification réelle
> de la boutique possible depuis cette session, le blocage réseau mentionné dans `CLAUDE.md`
> n'est plus d'actualité)

## 🟢 Fait (préparé dans le dépôt)
- [x] Audit red team complet (`AUDIT.md`)
- [x] Kit contenu : fiches produits, textes accueil, collections, À propos, FAQ, Contact
- [x] 4 pages légales rédigées (`pages-legales/`)
- [x] Guides : identité de marque, conversion (CRO), SEO, plan d'action Shopify
- [x] Blocs HTML (guide des tailles, réassurance)
- [x] Agent d'automatisation Shopify (`agent/`) — code testé (syntaxe/JSON/markdown)
- [x] Règles permanentes gravées (`CLAUDE.md`)

## 🔴 EN LIGNE dans la vraie boutique (vérifié en direct via Shopify MCP le 2026-07-28)
- [x] **23 produits ACTIFS et publiés** (leggings, shorts, brassières, ensembles) — la
  stratégie a évolué de « 1 produit héros » vers un catalogue élargi (confirmé voulu
  par le propriétaire). Tous vendeur **KORE** (aucun résidu « ŌKEI » détecté sur les 23).
- [x] **Paiement Shopify Payments ACTIVÉ** (Shop Pay, Visa, Mastercard) — versements
  vers compte Boursorama EUR **d'Aïcha** (confirmé précédemment, pas re-vérifié ce jour)
- [x] **Pages légales créées + liées au footer** (vérifié précédemment, pas re-vérifié ce jour)
- [ ] **3 fiches gardent une URL brute copiée de CJ Dropshipping** (anglais, mots-clés
  en vrac, illisible) — signal amateur fort, à corriger en priorité :
  - `hip-pleated-hanging-accessories-design-hip-shrinking-ankle-length-pants-back-large-hollow-out-seamless-brassiere-suit`
  - `seamless-yoga-sport-set-fitness-women-running-leggings-short-sleeve-tops`
  - `tie-dye-printed-yoga-pants-summer-quick-drying-fitness-shorts-sexy-high-waisted-hip-lifting-leggings-women-pants`
- [ ] **Images produits pas encore auditées ce jour** (filigrane CJ possible — à vérifier
  visuellement, l'aperçu texte ne le montre pas)
- [ ] **Bannière/thème optimisé** (à faire sur PC — non bloquant)
- [ ] **Trafic = 1ʳᵉ vidéo TikTok** (rôle d'Aïcha) ← le vrai levier restant

## ▶️ Prochaines étapes (ordre d'impact red team)
1. [ ] **Renommer les 3 URLs brutes CJ** (voir liste ci-dessus) en français, propres
2. [ ] **Auditer les images des 23 fiches** (filigrane, cohérence visuelle)
3. [ ] **Avis** — installer Judge.me, supprimer les faux placeholders
4. [ ] **Vérifier stocks affichés** — chiffres CJ bruts (ex: 40000, 13252) peuvent
   paraître louches s'ils sont visibles publiquement
5. [ ] **Paiement express + domaine perso**

## ⏳ Bloquants « humains » (à préparer en parallèle — voir `guide/a-completer.md`)
- [ ] Photos produits propres (sans filigrane)
- [x] SIRET / statut juridique → **Aïcha DIALLO, micro-entreprise** (à vérifier : code APE achat-revente)
- [x] Domaine acheté : **korewear.fr** (déjà dans la boutique)
- [ ] Adresse du siège d'Aïcha (dernier champ manquant des mentions légales)
- [ ] Activer la redirection email **contact@korewear.fr** → boîte perso
- [x] Délais de livraison réels → **5-10 j** (CJPacket Fast Ordinary)
- [ ] Médiateur de la consommation
- [ ] (Optionnel) Débloquer le réseau de l'environnement web pour audit live

## 🚀 Lancement express (chantier prioritaire — revenu rapide)
1. [x] **Fournisseur choisi : CJ Dropshipping** (gratuit, app installée + connectée à Shopify)
2. [x] **Legging héros sélectionné** : « Seamless Leggings High Waist Push Up » (CJ)
3. [x] **Expédition réglée** : China Warehouse → CJPacket Fast Ordinary **5-10 j**, profil
   CJ « Livraison offerte » 0 € synchronisé vers Shopify
4. [x] **Prix de vente fixé : 34,90 €** (coût ~13 € → profit ~21 €/vente), coloris **Noir**
5. [ ] Onglet **Images** CJ : ne garder que les **photos propres** (sans filigrane) → **Listez-le**
6. [ ] Dans Shopify : corriger **Vendeur ŌKEI → KORE** + coller la fiche (`produit-hero.md`)
   + les 2 blocs HTML (guide tailles + réassurance)
7. [ ] **Publier** (passer de « préparé » à « EN LIGNE »)
8. [ ] Coller les **4 pages légales** + lier au footer
9. [ ] Poster la **1ʳᵉ vidéo TikTok** (lien en bio)

## 🧠 Décisions actées
- Marque retenue : **KORE** (supprimer « ŌKEI »).
- **Niche : activewear féminin** (legging/brassière) — nom KORE = « core/corps ».
- **Stratégie : 1 produit héros d'abord** (legging sculptant seamless), pas un catalogue.
- **Fournisseur : CJ Dropshipping** (gratuit, illimité, français, fulfillment auto). BigBuy
  écarté (app 1.1/5 + compte payant), Spocket écarté (limite 10 produits). Printify/brandé
  **plus tard**, après un gagnant prouvé (séquence, pas parallèle).
- **Legging héros** : China Warehouse, livraison **5-10 j** (assumée honnêtement sur la fiche),
  **livraison offerte** au client, **prix 34,90 €**, coloris noir.
- ⚠️ Pas de faux prix barré (loi Omnibus). Zéro dépense optionnelle avant 1ʳᵉ vente
  (pas de BigBuy/Printify/Reviews Rocket maintenant).
- **Entité légale : micro-entreprise d'Aïcha DIALLO** (SIRET 98975496500014). Elle est
  l'exploitante et pilotera la boutique au quotidien. Mentions légales remplies à son nom.
  ⚠️ À vérifier : code APE couvre l'achat-revente + question juridique sur le titre de séjour
  du conjoint (permanence Forum Réfugiés / Cimade).
- Priorité : **lancer d'abord**, monter une équipe d'agents plus tard.
