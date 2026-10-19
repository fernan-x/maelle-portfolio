import socialA from "@/assets/social-media-contenu.webp";
import socialASm from "@/assets/social-media-contenu-640.webp";
import socialB from "@/assets/social-media-kpi.webp";
import socialBSm from "@/assets/social-media-kpi-640.webp";
import creaA from "@/assets/creation-digital.webp";
import creaASm from "@/assets/creation-digital-640.webp";
import creaB from "@/assets/creation-print.webp";
import creaBSm from "@/assets/creation-print-640.webp";
import webA from "@/assets/website-refonte.webp";
import webASm from "@/assets/website-refonte-640.webp";
import webB from "@/assets/website-amelioration-kpi.webp";
import webBSm from "@/assets/website-amelioration-kpi-640.webp";
const img = (src: string, small: string) => ({ src, small });
const social1 = img(socialA, socialASm), social2 = img(socialB, socialBSm);
const graphic1 = img(creaA, creaASm), graphic2 = img(creaB, creaBSm);
const web1 = img(webA, webASm), web2 = img(webB, webBSm);
import eventA from "@/assets/evenementiel-design.webp";
import eventASm from "@/assets/evenementiel-design-640.webp";
import eventB from "@/assets/evenementiel-design-com.webp";
import eventBSm from "@/assets/evenementiel-design-com-640.webp";
const event1 = img(eventA, eventASm), event2 = img(eventB, eventBSm);

export type GalleryItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; alt: string }
  | { type: "embed"; src: string; alt: string };

/** `small` is the 640w variant used in the page cards; `src` is the 1200w one used in the gallery. */
export type ProjectImage = { src: string; small: string; alt: string };

export type Project = {
  title: string;
  kicker: string;
  body: string;
  bullets: string[];
  tone: "ink" | "lilac" | "wisteria" | "spruce";
  images: [ProjectImage, ProjectImage];
  /** Texte détaillé affiché dans la popup « En savoir plus ». Une entrée = un paragraphe ; "Label : texte" met le label en gras. */
  details?: { heading?: string; paragraphs: string[] };
  /** Médias supplémentaires affichés dans la popup (images, vidéos mp4, liens Instagram/Facebook). */
  gallery?: GalleryItem[];
};

export const projects: Project[] = [
  {
    title: "Réseaux sociaux",
    kicker: "Stratégie & contenus",
    body: "Mon point de départ : comprendre l'expertise de l'entreprise pour la transformer en contenus que l'audience a envie de regarder. Je les produis de A à Z (vidéos, carousels, trends, stories), ma connaissance des algorithmes guide les formats, les publicités ciblées accompagnent les temps forts, et le suivi des KPIs permet d'analyser et d'ajuster.",
    bullets: ["5M+ de vues en moins d'un an", "Montage vidéo", "Réalisation d'interviews", "Maîtrise des réseaux sociaux", "Adobe", "CapCut"],
    tone: "ink",
    images: [{ ...social1, alt: "Contenus réseaux sociaux" }, { ...social2, alt: "Résultats réseaux sociaux" }],
    details: {
      heading: "En pratique",
      paragraphs: [
        "GEA Farm Technologies France : création des pages et de la stratégie, avec pour objectif de gagner en visibilité et en notoriété et de développer l'image de marque.",
        "Washpower France : création des pages et de la stratégie, avec pour objectif de développer l'image de marque et de détecter des leads. Résultat : 5M+ de vues en moins d'un an, et des prospects qui nous contactaient pour organiser des démos.",
        "Le point commun de ces 2 expériences ? Le milieu agricole. Dans l'agricole, rien n'est plus parlant qu'un éleveur qui s'adresse à un autre éleveur. J'ai donc misé sur des interviews vidéo d'éleveurs qui parlent des robots, complétées par des posts plus orientés produit pour affirmer l'expertise de la marque.",
      ],
    },
  },
  {
    title: "Site web",
    kicker: "SEO & UX",
    body: "Avoir un site web est devenu indispensable. Qu'il apporte de vrais résultats est l'étape d'après. Je pars de l'objectif du site, puis je travaille tout ce qui le soutient : mots-clés les plus performants, meta data à jour, images optimisées, contenu pensé page par page.",
    bullets: ["Refonte de site : arborescence, parcours utilisateur, cahier des charges, coordination dev", "Optimisation SEO : mots-clés, meta data, images, contenus", "Articles conçus autour des intentions de recherche", "Reporting et suivi des KPIs"],
    tone: "wisteria",
    images: [{ ...web1, alt: "Refonte de site web" }, { ...web2, alt: "Amélioration des KPIs du site" }],
    details: {
      paragraphs: [
        "Witbe : le site ne répondait pas aux besoins des commerciaux, ne générait pas de trafic, et la technologie vendue n'y était pas comprise. J'ai piloté sa refonte depuis la base : objectifs et besoins, nouvelle arborescence, contenu des pages, parcours utilisateur, sélection d'une agence de webdesign, production des textes et des images, puis développement. Des articles construits sur les recherches les plus courantes de la cible ont positionné l'entreprise comme experte de son domaine.",
        "Washpower : l'arborescence était bonne, mais les mots-clés n'étaient pas travaillés, il n'y avait aucune meta data, les images n'étaient pas optimisées et les pages produits ne répondaient pas aux objectifs. Après avoir redéfini ces objectifs, j'ai retravaillé les contenus et les sections pour présenter les produits et convertir le formulaire de contact. J'ai aussi ajouté des articles de témoignages d'éleveurs, bâtis sur leurs problématiques et leurs intentions de recherche : ce sont les pages qui convertissaient le mieux.",
      ],
    },
  },
  {
    title: "Créations graphiques",
    kicker: "Design & production",
    body: "Tout part du brief : je transforme un besoin, un message ou un produit technique en un support clair. Je respecte la charte graphique tout en cherchant à lui donner de nouvelles dimensions, et j'adapte chaque création à son format, du print au digital.",
    bullets: ["Créations digitales", "Vidéos : interviews et présentations produit", "Réseaux sociaux", "Publicités papier et digitales", "Design de stand", "Signalétique extérieure : roll-ups et drapeaux", "Goodies"],
    tone: "lilac",
    images: [{ ...graphic1, alt: "Créations digitales" }, { ...graphic2, alt: "Créations print" }],
  },
  {
    title: "Événementiel",
    kicker: "Salons & démos",
    body: "Un événement est avant tout une action de communication : je le pilote comme un projet, des objectifs jusqu'aux retombées. En agricole, la concurrence est forte et les éleveurs visitent de nombreux stands : l'enjeu est d'être sur la liste des stands à voir de la cible.",
    bullets: ["SPACE, Sommet de l'Élevage, journées démos", "Conception de stand et signalétique", "Relations presse et communiqués", "Promotion digitale : réseaux sociaux, site web, concours", "Mesure des retombées"],
    tone: "spruce",
    images: [{ ...event1, alt: "Design de stand événementiel" }, { ...event2, alt: "Communication autour de l'événement" }],
    details: {
      heading: "Ma méthode, appliquée aux éditions du SPACE et du Sommet de l'Élevage que j'ai organisées",
      paragraphs: [
        "Objectifs et stratégie : définir ce que l'événement doit apporter.",
        "To-do list et deadlines : tenir le processus administratif sans rien oublier.",
        "Design anticipé : un stand prend toujours plus de temps que prévu.",
        "Promotion : trouver un angle qui amène du trafic sur le stand (concours, encart presse papier ou digital, PR, réseaux sociaux, site web).",
        "Mesure des retombées : un outil pensé en amont, car ce n'est pas un bonus sur un salon professionnel.",
        "Des étapes et des deadlines claires permettent de garder le fil du projet.",
      ],
    },
  },
];

export const strengths = [
  {
    title: "Stratégie digitale",
    text: "Élaboration de plans d'actions complets et pilotage des KPIs, du cadrage à la mesure d'impact.",
  },
  {
    title: "Créativité opérationnelle",
    text: "Je conçois et je produis : vidéo, print, digital. De l'idée au fichier final livré.",
  },
  {
    title: "Data & performance",
    text: "Google Analytics, Tag Manager, reporting SEO/SEA, suivi d'engagement et d'acquisition.",
  },
  {
    title: "Coordination",
    text: "Agences, développeurs, graphistes, maison mère, réseau revendeur : je fais avancer les projets.",
  },
  {
    title: "Esprit d'équipe",
    text: "Je travaille main dans la main avec les équipes sales, produit et tech. Pour moi, l'humain passe d'abord : écouter, rassembler et avancer ensemble.",
  },
  {
    title: "Gestion de projet",
    text: "J'adore gérer des projets : organiser, découper, suivre, de leur naissance à leur accomplissement.",
  },
];

export const experiences = [
  { company: "Washpower France", role: "Responsable Marketing & Communication", period: "2025 — 2026" },
  { company: "Witbe New York", role: "Digital & SEO Specialist", period: "2024 — 2025" },
  { company: "GEA Farm Technologies France", role: "Responsable Marketing & Communication", period: "2020 — 2023" },
];

export const highlights = [
  { value: "5M+", text: "de vues cumulées en 1 an sur les réseaux sociaux de Washpower France" },
  { value: "10+", text: "salons pro organisés, de la stratégie au jour J\u00a0: budget, design, logistique" },
  { value: "2", text: "refontes de site web pilotées de A à Z, du SEO aux contenus" },
  { value: "6+", text: "ans d'expérience en marketing et communication" },
];

export const toolGroups = [
  { label: "Social", items: ["Meta Business", "Meta Ads", "TikTok", "LinkedIn"] },
  { label: "Google & web", items: ["Google Ads", "Analytics", "Tag Manager", "WordPress"] },
  { label: "Projet", items: ["Microsoft Planner", "To Do", "Loop", "Notion"] },
  { label: "CRM", items: ["Salesforce", "HubSpot"] },
  { label: "IA", items: ["Claude", "ChatGPT"] },
  { label: "Création", items: ["InDesign", "Illustrator", "Premiere Pro", "Photoshop", "Figma", "Canva", "CapCut"] },
];
