export interface MultiverseEntry {
  id: string;
  title: string;
  year: number;
  group: string;
  note: string;
  relevance: 'direct' | 'context' | 'bonus';
}

export const MULTIVERSE_GROUPS = [
  { id: 'xmen', name: 'X-Men · univers Fox', icon: '✕', intro: 'Les mutants, leurs différentes générations et les films de Wolverine.' },
  { id: 'deadpool', name: 'Deadpool · avant le MCU', icon: '⚔️', intro: 'Les deux aventures de Wade Wilson avant Deadpool & Wolverine.' },
  { id: 'blade', name: 'Blade', icon: '🗡️', intro: 'Le film de 1998 avec Wesley Snipes.' },
  { id: 'spider-raimi', name: 'Spider-Man · Tobey Maguire', icon: '🕸️', intro: 'La trilogie de Sam Raimi, dont les personnages reviennent dans No Way Home.' },
  { id: 'spider-webb', name: 'The Amazing Spider-Man · Andrew Garfield', icon: '🕷️', intro: 'L’autre Peter Parker et ses adversaires avant leur rencontre avec le MCU.' },
  { id: 'spiderverse', name: 'Spider-Verse · animation', icon: '🌈', intro: 'Le multivers de Miles Morales, à regarder comme une saga à part.' },
] as const;

// Ordre de sortie à l’intérieur de chaque univers. Les liens avec les futurs Avengers
// restent des indications de contexte, jamais des apparitions promises.
export const multiverseEntries: MultiverseEntry[] = [
  { id: 'alt-spider-man-2002', title: 'Spider-Man', year: 2002, group: 'spider-raimi', relevance: 'direct', note: 'Origines du Peter Parker de Tobey Maguire et du Bouffon Vert.' },
  { id: 'alt-spider-man-2', title: 'Spider-Man 2', year: 2004, group: 'spider-raimi', relevance: 'direct', note: 'Peter affronte le Docteur Octopus.' },
  { id: 'alt-spider-man-3', title: 'Spider-Man 3', year: 2007, group: 'spider-raimi', relevance: 'direct', note: 'Le retour de l’Homme-Sable et l’histoire du symbiote.' },
  { id: 'alt-amazing-spider-man', title: 'The Amazing Spider-Man', year: 2012, group: 'spider-webb', relevance: 'direct', note: 'Origines du Peter Parker d’Andrew Garfield et rencontre avec le Lézard.' },
  { id: 'alt-amazing-spider-man-2', title: 'The Amazing Spider-Man : Le Destin d’un héros', year: 2014, group: 'spider-webb', relevance: 'direct', note: 'Peter affronte Electro ; son histoire avec Gwen marque son retour dans No Way Home.' },
  { id: 'alt-x-men', title: 'X-Men', year: 2000, group: 'xmen', relevance: 'direct', note: 'Première rencontre avec les mutants de Charles Xavier et Magneto.' },
  { id: 'alt-x2', title: 'X-Men 2', year: 2003, group: 'xmen', relevance: 'direct', note: 'Les X-Men s’unissent face à une menace qui vise tous les mutants.' },
  { id: 'alt-last-stand', title: 'X-Men : L’Affrontement final', year: 2006, group: 'xmen', relevance: 'context', note: 'La première trilogie se conclut autour du « remède » mutant et du Phénix.' },
  { id: 'alt-wolverine-origins', title: 'X-Men Origins: Wolverine', year: 2009, group: 'xmen', relevance: 'bonus', note: 'Retour sur le passé de Logan et le programme Weapon X.' },
  { id: 'alt-first-class', title: 'X-Men : Le Commencement', year: 2011, group: 'xmen', relevance: 'direct', note: 'Rencontre de Charles et Erik, et naissance de leur rivalité.' },
  { id: 'alt-the-wolverine', title: 'Wolverine : Le Combat de l’immortel', year: 2013, group: 'xmen', relevance: 'context', note: 'Une aventure de Logan au Japon après la première trilogie.' },
  { id: 'alt-days-future-past', title: 'X-Men: Days of Future Past', year: 2014, group: 'xmen', relevance: 'direct', note: 'Les deux générations de X-Men se croisent dans une histoire de voyage temporel.' },
  { id: 'alt-apocalypse', title: 'X-Men: Apocalypse', year: 2016, group: 'xmen', relevance: 'context', note: 'La jeune équipe affronte Apocalypse.' },
  { id: 'alt-logan', title: 'Logan', year: 2017, group: 'xmen', relevance: 'direct', note: 'Un chapitre essentiel de l’histoire de Wolverine, évoqué dans Deadpool & Wolverine.' },
  { id: 'alt-dark-phoenix', title: 'X-Men: Dark Phoenix', year: 2019, group: 'xmen', relevance: 'context', note: 'La seconde génération affronte la puissance du Phénix.' },
  { id: 'alt-deadpool', title: 'Deadpool', year: 2016, group: 'deadpool', relevance: 'direct', note: 'Origines de Wade Wilson, accompagné de personnages X-Men.' },
  { id: 'alt-deadpool-2', title: 'Deadpool 2', year: 2018, group: 'deadpool', relevance: 'direct', note: 'Wade rencontre Cable et forme X-Force.' },
  { id: 'alt-into-spiderverse', title: 'Spider-Man: New Generation', year: 2018, group: 'spiderverse', relevance: 'context', note: 'Miles Morales découvre d’autres Spider-People.' },
  { id: 'alt-across-spiderverse', title: 'Spider-Man: Across the Spider-Verse', year: 2023, group: 'spiderverse', relevance: 'context', note: 'Miles traverse les univers et rencontre la Spider-Society.' },
  { id: 'alt-blade', title: 'Blade', year: 1998, group: 'blade', relevance: 'context', note: 'Wesley Snipes incarne le chasseur de vampires dans le premier film.' },
];
