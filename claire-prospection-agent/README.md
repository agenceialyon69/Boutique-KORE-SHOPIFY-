# 📨 Agent Prospection CLAIRE
Génère, pour chaque cabinet dentaire, une séquence d'outreach personnalisée
(objet + email + 2 relances + script d'appel) — posture « avis d'expert, pas vente ».

## Installation (une fois)
1. Installe Node.js (nodejs.org) si pas déjà fait.
2. Copie `config.example.json` → `config.json`, mets ta `claudeApiKey`.
3. Copie `cabinets.example.json` → `cabinets.json`, remplis ta vraie liste (nom, ville, email).

## Lancer
```
node index.js
```
→ Les messages sont écrits dans le dossier `messages/` (1 fichier .md par cabinet).

## Règles (gravées)
- ⚠️ JAMAIS d'envoi automatique : tu RELIS chaque message, puis tu l'envoies toi-même.
- Zéro fausse référence (pas encore de clients → on mise sur l'offre fondateur + essai gratuit).
- Prospection B2B : objet clair + désinscription possible (RGPD pro).
