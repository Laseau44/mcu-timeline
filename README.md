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
- Export de la progression au format JSON en bas de page.

## Ambiance immersive

Les collections, fiches et carte partagent une identité argentée, bleue et lilas, une navigation horizontale et des panneaux translucides. Le fond est calculé en WebGL : champs lumineux, grain fixe, déformation radiale et répulsion des centres lumineux au passage du pointeur, puis retour progressif. Le toucher utilise les mêmes événements sans bloquer le défilement.

Le bouton **Ambiance animée / Ambiance figée** mémorise le choix dans `marvel-ambience`. Sans choix explicite, les préférences de réduction des mouvements du système s’appliquent. Le fond est rendu à 30 images par seconde au maximum, avec une résolution limitée ; il s’arrête lorsque l’onglet est masqué et lorsqu’il est figé. Un fond CSS remplace WebGL en cas d’indisponibilité. Le mouvement de la sculpture possède sa propre commande sur la carte.

Les images d’inspiration ne sont pas intégrées comme fichiers au site : les lumières et le grain sont procéduraux.

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

## Carte des univers

La page `#/carte` propose neuf repères de la sélection : MCU, X-Men/Deadpool, Raimi, Amazing Spider-Man, Blade, Miles, Gwen, Terre-838 et TVA. Scène 3D Three.js chargée à la demande : rubans métalliques, verre irisé et filaments sur fond noir. Aucune clé API supplémentaire. Les repères et films restent consultables si WebGL est indisponible.

- Glisser pour pivoter ; sélectionner « Déplacer » pour déplacer la carte.
- Zoom : molette, boutons +/− ou pincement à deux doigts avec OrbitControls. Le pincement reste à vérifier sur appareil tactile physique.
- Clavier : +/− pour zoomer et 0 pour recentrer ; Tab et Entrée pour choisir un univers.
- « Immersion » ouvre une vue agrandie ; Échap permet d’en sortir.
- Composition épurée : navigation horizontale, typographie géométrique, sculpture centrale et fiche de réalité. Les reflets sont calculés à partir de lumières de studio. Le mouvement automatique peut être suspendu et respecte la réduction des mouvements du système. Le rendu est limité à 30 images par seconde et suspendu hors écran.
- Fiches de films et progression reliées au même stockage que les collections.
- Passages entre univers masqués par défaut, activables avec l’option spoilers.

Les positions sont illustratives, les branches X-Men sont regroupées et le TVA n’est pas présenté comme une Terre. Les fiches expliquent les conventions de numérotation (notamment 616/199999 et les versions animées distinctes des comics) et fournissent leurs sources. Aucun futur crossover n’est prédit.

## Sauvegarde des statuts

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

React 19, TypeScript, Vite 7, Three.js, Zustand et Supabase optionnel.
