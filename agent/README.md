# 🤖 Agent KORE — automatisation de la boutique Shopify

Cet agent se connecte à ta boutique et fait à ta place le travail répétitif :
nettoyer la marque, réécrire les produits, créer les pages et les collections.

> ⚠️ **Il tourne sur TON ordinateur** (avec internet), pas depuis le serveur de Claude.
> Aucune donnée bancaire n'est manipulée. Ta clé d'API reste chez toi (jamais publiée).

---

## ✅ Ce qu'il sait faire

| Tâche | Ce qu'elle fait |
|---|---|
| `audit` | Analyse la boutique, liste les problèmes (lecture seule) |
| `fix-brand` | Supprime « ŌKEI » des titres + met le fournisseur sur KORE |
| `apply-products` | Applique les titres / descriptions / SEO réécrits |
| `create-pages` | Crée les pages : À propos, FAQ, mentions légales, CGV, etc. |
| `create-collections` | Crée les collections : Homme, Femme, Accessoires… |

---

## 🛠️ Installation (une seule fois)

### 1. Installer Node.js
Télécharge et installe **Node.js (version LTS)** : https://nodejs.org
Pour vérifier, ouvre un terminal et tape : `node -v` (un numéro doit s'afficher).

### 2. Récupérer ce dossier sur ton ordinateur
- Soit tu télécharges le dépôt en ZIP depuis GitHub, soit tu fais `git clone`.
- Place-toi dans le dossier `agent/`.

### 3. Créer ta clé d'API Shopify (≈ 5 min)
Dans ton **admin Shopify** :
1. **Réglages → Applications et canaux de vente → Développer des applications**
2. **Créer une application** → nomme-la « Agent KORE »
3. Onglet **Configuration → Admin API → Configurer les autorisations**, coche :
   - `read_products`, `write_products`
   - `read_content`, `write_content`  *(pour les pages)*
4. **Enregistrer** → bouton **Installer l'application**
5. Onglet **Identifiants de l'API → Jeton d'accès Admin API → Révéler** :
   copie le jeton qui commence par `shpat_…`

### 4. Renseigner la config
- Copie le fichier `config.example.json` et renomme la copie en **`config.json`**.
- Ouvre `config.json` et remplis :
  ```json
  {
    "shop": "hbv1uj-b9.myshopify.com",
    "token": "shpat_LE_JETON_QUE_TU_AS_COPIÉ",
    "brand": "KORE"
  }
  ```
> 🔒 `config.json` est automatiquement **ignoré par Git** : ta clé ne sera jamais publiée.

---

## ▶️ Utilisation

Ouvre un terminal **dans le dossier `agent/`** puis lance :

```bash
# 1) D'abord, regarder l'état de la boutique (ne modifie rien)
node index.js audit

# 2) Simuler une tâche (montre ce qui serait fait, sans rien changer)
node index.js fix-brand

# 3) Appliquer pour de vrai (ajoute --apply)
node index.js fix-brand --apply
```

**Ordre conseillé :**
```bash
node index.js audit
node index.js fix-brand --apply
node index.js apply-products --apply
node index.js create-pages --apply
node index.js create-collections --apply
```

> 💡 **Règle de sécurité :** lance TOUJOURS la commande sans `--apply` d'abord
> (mode simulation) pour vérifier, puis ajoute `--apply` quand tu es sûr.

---

## ⚠️ À savoir (honnêteté)
- Cet agent n'a **pas pu être testé en direct** sur ta boutique depuis l'environnement
  de Claude (réseau bloqué). Au **premier lancement**, il se peut qu'un petit ajustement
  soit nécessaire — envoie le message d'erreur à Claude, il corrige.
- L'agent ne peut **pas** : prendre tes photos, inventer ton SIRET, écrire de vrais avis,
  ni activer les paiements/domaine (ces étapes restent humaines — c'est la loi).
- **Avant de publier les pages légales**, remplis les `[À COMPLÉTER]` (SIRET, e-mail…).

---

## 🆘 En cas de souci
Copie-colle le message du terminal à Claude. Erreurs fréquentes :
- `config.json introuvable` → tu n'as pas créé le fichier (étape 4).
- `401 / 403` → le jeton est faux ou les autorisations manquent (étape 3).
- `Cannot find module` → tu n'es pas dans le dossier `agent/` quand tu lances la commande.
