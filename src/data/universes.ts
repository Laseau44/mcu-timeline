import { allMovies } from './catalogue';

export interface Universe {
  id: string; code: string; name: string; hero: string; color: string;
  position: [number, number, number]; radius: number;
  description: string; note: string; movies: string[];
  source: { title: string; url: string };
}
const marvelGuide = { title: 'Marvel · Désignations du multivers', url: 'https://www.marvel.com/articles/comics/this-week-in-marvel-universes-earth-616' };
const spiderScript = { title: 'TIME · Guide des personnages du Spider-Verse', url: 'https://time.com/6284549/spider-man-across-the-spider-verse-spider-people/' };
const groupMovies = (group: string) => allMovies.filter(m => m.group === group).map(m => m.id);

export const universes: Universe[] = [
  { id: 'mcu', code: 'TERRE-616', name: 'L’univers des Avengers', hero: 'Le MCU', color: '#65e8fa', position: [0, 15, 60], radius: 55,
    description: 'Le point de départ de votre marathon : Iron Man, Captain America, Thor et les Avengers. Une réalité parmi une infinité d’autres.',
    note: '616 est le nom employé dans les films du MCU. Le catalogue historique de Marvel utilise aussi 199999. La Terre-616 des comics est une continuité distincte.',
    movies: ['iron-man', 'avengers', 'infinity-war', 'endgame', 'spider-man-no-way-home', 'doctor-strange-multiverse', 'deadpool-wolverine'], source: { title: 'Repères 616 / 199999', url: 'https://en.wikipedia.org/wiki/Earth-616' } },
  { id: 'xmen', code: 'TERRE-10005', name: 'Les mutants', hero: 'X-Men · Wolverine · Deadpool', color: '#ffc16c', position: [-290, -165, 10], radius: 41,
    description: 'Charles Xavier, Magneto, Logan et Wade Wilson : les films X-Men et Deadpool de votre collection se retrouvent dans ce secteur.',
    note: '10005, avec trois zéros, est le repère des films X-Men. Leurs branches temporelles sont regroupées ici pour la lecture ; elles ne constituent pas une chronologie unique sans divergences.',
    movies: [...groupMovies('xmen'), ...groupMovies('deadpool'), 'deadpool-wolverine'], source: marvelGuide },
  { id: 'raimi', code: 'TERRE-96283', name: 'Le premier Spider-Man', hero: 'Peter Parker · Tobey Maguire', color: '#fa8d95', position: [275, -195, -30], radius: 35,
    description: 'Le New York de la trilogie de Sam Raimi : Peter Parker, Mary Jane, le Bouffon Vert et le Docteur Octopus.',
    note: 'Le numéro 96283 figure dans le catalogue des univers présenté par Marvel.', movies: groupMovies('spider-raimi'), source: marvelGuide },
  { id: 'webb', code: 'TERRE-120703', name: 'The Amazing Spider-Man', hero: 'Peter Parker · Andrew Garfield', color: '#7da8ff', position: [295, 125, 15], radius: 34,
    description: 'Une autre vie pour Peter Parker, auprès de Gwen Stacy. Les deux films de Marc Webb forment cette saga.',
    note: '120703 est la désignation de catalogue couramment utilisée pour cette continuité.', movies: groupMovies('spider-webb'), source: { title: 'Marvel Database · Terre-120703', url: 'https://marvel.fandom.com/wiki/Earth-120703' } },
  { id: 'blade', code: 'TERRE-26320', name: 'Le monde de Blade', hero: 'Eric Brooks · Wesley Snipes', color: '#b995ff', position: [-340, 120, -65], radius: 32,
    description: 'Dans l’ombre des villes, Blade traque les vampires. Votre sélection conserve son premier film, sorti en 1998.',
    note: '26320 est le numéro associé par Marvel aux films Blade. Seul le film demandé est proposé dans cette carte.', movies: ['alt-blade'], source: marvelGuide },
  { id: 'miles', code: 'TERRE-1610', name: 'Le Brooklyn de Miles', hero: 'Miles Morales · Animation', color: '#fc7bd1', position: [-190, 275, 20], radius: 36,
    description: 'Le monde de Miles Morales dans les films Spider-Verse. Un point de départ vers de nombreux styles, héros et réalités.',
    note: 'Repère utilisé dans les films d’animation. Il ne faut pas confondre cette version avec l’univers Ultimate des comics, lui aussi numéroté 1610.', movies: groupMovies('spiderverse'), source: spiderScript },
  { id: 'gwen', code: 'TERRE-65', name: 'Le monde de Gwen', hero: 'Gwen Stacy · Animation', color: '#91ffe0', position: [110, 290, -45], radius: 30,
    description: 'Un univers aux couleurs d’aquarelle où Gwen Stacy porte le masque. Il se découvre dans les films Spider-Verse de votre liste.',
    note: 'La carte présente la version animée de cette Terre, distincte de sa version dans les comics.', movies: groupMovies('spiderverse'), source: spiderScript },
  { id: '838', code: 'TERRE-838', name: 'Une autre réalité', hero: 'Doctor Strange · Multiverse of Madness', color: '#c4d590', position: [65, -275, -60], radius: 29,
    description: 'Une autre Terre explorée dans Doctor Strange in the Multiverse of Madness. Retrouvez le film pour découvrir ce qui distingue ce monde.',
    note: '838 est une désignation donnée dans le film. Ses personnages ne sont pas automatiquement ceux des autres adaptations.', movies: ['doctor-strange-multiverse'], source: { title: 'Doctor Strange · Les réalités du film', url: 'https://en.wikipedia.org/wiki/Stephen_Strange_(Marvel_Cinematic_Universe)' } },
  { id: 'tva', code: 'HORS DU TEMPS', name: 'Le TVA', hero: 'Tribunal des Variations Anachroniques', color: '#ffd9a4', position: [-160, -60, -240], radius: 24,
    description: 'Un observatoire des lignes temporelles, à retrouver dans Loki et Deadpool & Wolverine. Un repère à part dans le multivers.',
    note: 'Le TVA n’est pas une Terre numérotée. Sa position sur cette carte est symbolique.', movies: ['loki-s1', 'loki-s2', 'deadpool-wolverine'], source: { title: 'Marvel · Loki', url: 'https://www.marvel.com/tv-shows/loki/2' } },
];

// Only released on-screen crossovers; placement and paths are illustrative.
export const passages = [
  { from: 'raimi', to: 'mcu', film: 'Spider-Man: No Way Home' },
  { from: 'webb', to: 'mcu', film: 'Spider-Man: No Way Home' },
  { from: '838', to: 'mcu', film: 'Doctor Strange in the Multiverse of Madness' },
  { from: 'xmen', to: 'mcu', film: 'Deadpool & Wolverine' },
  { from: 'xmen', to: 'tva', film: 'Deadpool & Wolverine' },
  { from: 'mcu', to: 'tva', film: 'Loki' },
  { from: 'miles', to: 'gwen', film: 'Spider-Man: Across the Spider-Verse' },
];
