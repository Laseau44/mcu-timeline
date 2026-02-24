# 🎬 MCU Timeline

Chronologie interactive complète du Marvel Cinematic Universe — de Captain America: First Avenger jusqu'à Avengers: Secret Wars.

![MCU Timeline](https://img.shields.io/badge/MCU-Timeline-ed1d24?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-7-646cff?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge)

## ✨ Fonctionnalités

- **56 entrées MCU** ordonnées chronologiquement dans l'histoire (pas l'ordre de sortie)
- **6 Phases rétractables** avec codes couleur par saga
- **Suivi de visionnage** : Pas vu / En cours / Vu, persisté via Supabase ou localStorage
- **Posters TMDB** automatiquement récupérés via l'API
- **Barre de progression** globale et par phase
- **Filtres** par type (Film / Série / Spécial), par statut, et recherche par titre
- **Design cosmique sombre** avec étoiles animées, polices Bebas Neue + DM Sans
- **Fully responsive** mobile

## 🚀 Setup en 5 étapes

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd MCU-Timeline
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'environnement

```bash
cp .env.example .env
```

Remplir `.env` avec vos clés :

| Variable | Description |
|----------|-------------|
| `VITE_TMDB_API_KEY` | Clé API TMDB ([obtenir ici](https://www.themoviedb.org/settings/api)) |
| `VITE_SUPABASE_URL` | URL de votre projet Supabase (optionnel) |
| `VITE_SUPABASE_ANON_KEY` | Clé anon publique Supabase (optionnel) |

> **Note** : L'app fonctionne sans Supabase (les statuts sont sauvegardés en localStorage). Sans clé TMDB, un emoji 🎬 remplace les posters.

### 4. Créer la table Supabase (optionnel)

Dans l'éditeur SQL de votre projet Supabase, exécuter le contenu de `supabase.sql`.

### 5. Lancer en développement

```bash
npm run dev
```

## 🏗️ Stack technique

| Outil | Usage |
|-------|-------|
| **Vite + React 19** | Build + Framework UI |
| **TypeScript** | Typage statique |
| **Tailwind CSS v4** | Utilitaires CSS |
| **Zustand** | State management |
| **Supabase** | Persistance cloud (optionnel) |
| **TMDB API** | Posters et images |

## 📁 Structure

```
src/
├── data/mcu.ts          # 56 entrées MCU
├── lib/
│   ├── supabaseClient.ts # Client Supabase
│   ├── session.ts        # Session anonyme UUID
│   └── tmdb.ts           # API TMDB
├── store/store.ts        # Zustand store
├── components/
│   ├── Header.tsx
│   ├── StatsBar.tsx
│   ├── ProgressBar.tsx
│   ├── FilterBar.tsx
│   ├── PhaseSection.tsx
│   ├── EntryCard.tsx
│   ├── StatusDropdown.tsx
│   └── ScrollToTop.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## 🚢 Déploiement

L'app est prête pour **Netlify** ou **Vercel** :

```bash
npm run build
```

Les fichiers de production seront dans `dist/`.

## 📄 Licence

MIT
