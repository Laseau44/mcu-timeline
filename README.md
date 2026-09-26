# MCU Timeline — Notre marathon

Une collection Marvel à regarder à deux, avec affiches, fiches de films et suivi du visionnage.

## Les deux collections

- **Timeline MCU** : 48 films et séries, regroupés en six phases selon la liste existante.
- **Le multivers** : 20 films, regroupés par saga et présentés dans leur ordre de sortie : X-Men/Wolverine (10), Deadpool (2), Blade (1998), Spider-Man de Sam Raimi (3), The Amazing Spider-Man (2), Spider-Verse (2).

La sélection multivers exclut Les Nouveaux Mutants, les séries animées, les anciens Fantastic Four et les films Sony dérivés comme Venom, Morbius ou Kraven. Deadpool & Wolverine reste dans la timeline MCU.

## Utilisation

- Navigation entre les collections, grille d’affiches ou liste compacte.
- Cases rapides et statuts **À voir / En cours / Vu ensemble**.
- Progression par collection et par chapitre, prochain titre à regarder (priorité aux titres en cours).
- Fiches avec affiche, résumé, année et durée lorsqu’elle est disponible.
- Recherche insensible aux accents ; filtres par statut, saga/phase et format.
- Interface responsive, navigation au clavier et fermeture des fiches avec Échap.
- Export de la progression au format JSON (menu latéral sur ordinateur, bas de page sur mobile).

## Installer et lancer

```bash
npm install
npm run dev
```

```bash
npm run lint
npm run build
npm run preview -- --configLoader runner
```

Le build de production est généré dans `dist/`. Pour Netlify : commande `npm run build`, dossier publié `dist`. Les routes `#/` et `#/multivers` fonctionnent sans règle de redirection supplémentaire.

## Sauvegarde

Les identifiants des titres et les clés de stockage de l’ancienne version sont conservés : `mcu-timeline-statuses` et `mcu-timeline-session-id`. Une mise à jour sur le même domaine conserve donc les données locales existantes. Une prévisualisation sur un autre domaine possède son propre stockage.

Supabase reste facultatif. Copier `.env.example` vers `.env` pour configurer `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`, puis utiliser le schéma de `supabase.sql`. La session anonyme existante est conservée ; ce mécanisme n’est pas un compte partagé automatiquement entre appareils.

## Affiches

`src/data/artwork.json` référence les images et les fiches publiques TMDB des 68 titres, collectées le 26 septembre 2026. Les visuels français sont utilisés lorsqu’ils sont disponibles. Les images sont chargées depuis le CDN TMDB, avec chargement différé des affiches hors écran et un remplacement lisible en cas d’échec.

Aucune clé API n’est nécessaire pour afficher cette sélection. `VITE_TMDB_API_KEY` est facultative et sert de solution de secours si une affiche ne se charge plus. Les durées des titres marqués « à venir » ne sont pas affichées. Les métadonnées, dates et visuels des futures sorties restent à maintenir.

Crédit des visuels : [TMDB](https://www.themoviedb.org/). Site personnel non affilié à Marvel et non approuvé par TMDB. Les affiches restent la propriété de leurs ayants droit.

## Structure

- `src/data/mcu.ts` : liste MCU existante.
- `src/data/multiverse.ts` : sélection multivers.
- `src/data/artwork.json` : références des affiches et fonds.
- `src/data/catalogue.ts` : modèle commun aux deux collections.
- `src/components/CataloguePage.tsx` : collection, filtres et progression.
- `src/components/MovieCard.tsx`, `MovieDialog.tsx`, `Poster.tsx` : présentation des films.
- `src/store/store.ts` : statuts et persistance.
- `src/index.css` : identité graphique et adaptation mobile.

React 19, TypeScript, Vite 7, Zustand et Supabase optionnel.
