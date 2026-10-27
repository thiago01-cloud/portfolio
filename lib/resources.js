// Configuration des rubriques gérées dans l'admin (une rubrique = une table).
// Ajouter une rubrique : la déclarer ici + son modèle dans prisma/schema.prisma.
import { formatPeriod, formatYears, PLATFORM_LABELS, splitList, STATUS_LABELS } from './format';

const LEVELS = Array.from({ length: 6 }, (_, n) => [String(n), n === 0 ? 'Non affiché' : `${n} / 5`]);

const visibleField = { name: 'visible', label: 'Afficher sur le site', type: 'checkbox', default: true };
const positionField = {
  name: 'position',
  label: "Ordre d'affichage",
  type: 'number',
  default: 0,
  help: 'Les plus petits nombres apparaissent en premier.',
};

export const RESOURCES = {
  projets: {
    addLabel: 'Ajouter un projet',
    model: 'project',
    label: 'Projets',
    singular: 'projet',
    hasImages: true,
    orderBy: [{ position: 'asc' }, { id: 'asc' }],
    title: (i) => i.name,
    subtitle: (i) => i.context,
    badges: (i) => [STATUS_LABELS[i.status] || i.status, i.featured ? 'Projet phare' : null],
    fields: [
      { name: 'name', label: 'Nom du projet', type: 'text', required: true },
      { name: 'slug', label: 'Adresse de la page', type: 'slug', from: 'name', help: 'Ex. diong. Générée depuis le nom si vide.' },
      { name: 'shortLabel', label: "Libellé court pour l'index d'accueil", type: 'text', help: 'Ex. PWA mariage' },
      { name: 'context', label: 'Contexte', type: 'text', help: 'Ex. GAM Gabon, depuis 2022' },
      { name: 'summary', label: 'Description', type: 'textarea', required: true },
      { name: 'features', label: 'Fonctionnalités clés', type: 'textarea', rows: 6, help: 'Une fonctionnalité par ligne.' },
      {
        name: 'story',
        label: 'Histoire du projet',
        type: 'textarea',
        rows: 12,
        help: "Comment l'idée est née, les défis rencontrés, ce que vous avez appris. Laissez une ligne vide entre deux paragraphes. Affichée dans l'onglet « Histoire du projet ».",
      },
      { name: 'stack', label: 'Technologies', type: 'text', help: 'Séparées par des virgules : Next.js, Prisma, Flutter' },
      { name: 'platforms', label: 'Plateformes', type: 'multi', options: Object.entries(PLATFORM_LABELS) },
      { name: 'status', label: 'Statut', type: 'select', options: Object.entries(STATUS_LABELS), default: 'development' },
      { name: 'themeColor', label: 'Couleur principale (fond du bloc)', type: 'color', default: '#206566', help: 'Reprenez la couleur dominante de l’application.' },
      { name: 'accentColor', label: "Couleur d'accent", type: 'color', default: '#1FA58F' },
      { name: 'demoUrl', label: 'Lien vers le projet en ligne', type: 'url' },
      { name: 'featured', label: 'Projet phare (bloc pleine largeur)', type: 'checkbox' },
      visibleField,
      positionField,
    ],
    columns: [
      { label: 'Projet', value: (i) => i.name },
      { label: 'Statut', value: (i) => STATUS_LABELS[i.status] || i.status },
      { label: 'Plateformes', value: (i) => splitList(i.platforms).map((p) => PLATFORM_LABELS[p] || p).join(', ') },
      { label: 'Captures', value: (i) => `${i._count?.images ?? 0} / 4` },
      { label: 'Histoire', value: (i) => (i.story ? 'Rédigée' : 'À écrire') },
      { label: 'Ordre', value: (i) => String(i.position) },
    ],
  },

  experiences: {
    addLabel: 'Ajouter une expérience',
    model: 'experience',
    label: 'Expériences',
    singular: 'expérience',
    orderBy: [{ startDate: 'desc' }],
    title: (i) => i.title,
    subtitle: (i) => `${i.company}${i.location ? `, ${i.location}` : ''}`,
    badges: (i) => [formatPeriod(i.startDate, i.endDate)],
    fields: [
      { name: 'title', label: 'Poste', type: 'text', required: true },
      { name: 'company', label: 'Entreprise', type: 'text', required: true },
      { name: 'location', label: 'Ville', type: 'text' },
      { name: 'startDate', label: 'Début', type: 'month', required: true },
      { name: 'endDate', label: 'Fin', type: 'month', help: 'Laisser vide pour le poste actuel.' },
      { name: 'description', label: 'Missions', type: 'textarea', rows: 5 },
      visibleField,
    ],
    columns: [
      { label: 'Poste', value: (i) => i.title },
      { label: 'Entreprise', value: (i) => i.company },
      { label: 'Période', value: (i) => formatPeriod(i.startDate, i.endDate) },
    ],
  },

  formations: {
    addLabel: 'Ajouter une formation',
    model: 'education',
    label: 'Formation',
    singular: 'formation',
    orderBy: [{ endYear: 'desc' }, { startYear: 'desc' }],
    title: (i) => i.title,
    subtitle: (i) => `${i.school}${i.location ? `, ${i.location}` : ''}`,
    badges: (i) => [formatYears(i.startYear, i.endYear)],
    fields: [
      { name: 'title', label: 'Diplôme', type: 'text', required: true },
      { name: 'school', label: 'Établissement', type: 'text', required: true },
      { name: 'location', label: 'Ville', type: 'text' },
      { name: 'startYear', label: 'Année de début', type: 'number' },
      { name: 'endYear', label: "Année d'obtention", type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea' },
      visibleField,
    ],
    columns: [
      { label: 'Diplôme', value: (i) => i.title },
      { label: 'Établissement', value: (i) => i.school },
      { label: 'Années', value: (i) => formatYears(i.startYear, i.endYear) },
    ],
  },

  competences: {
    addLabel: 'Ajouter une compétence',
    model: 'skill',
    label: 'Compétences',
    singular: 'compétence',
    orderBy: [{ position: 'asc' }, { id: 'asc' }],
    title: (i) => i.name,
    subtitle: (i) => i.category,
    badges: (i) => [i.level ? `${i.level} / 5` : null],
    fields: [
      { name: 'name', label: 'Compétence', type: 'text', required: true },
      { name: 'category', label: 'Catégorie', type: 'text', help: 'Facultatif. Ex. Développement, Gestion' },
      { name: 'level', label: 'Niveau', type: 'select', number: true, options: LEVELS, default: '0', help: 'Affiché en points, comme sur le CV.' },
      visibleField,
      positionField,
    ],
    columns: [
      { label: 'Compétence', value: (i) => i.name },
      { label: 'Catégorie', value: (i) => i.category },
      { label: 'Niveau', value: (i) => (i.level ? `${i.level} / 5` : '') },
      { label: 'Ordre', value: (i) => String(i.position) },
    ],
  },

  langues: {
    addLabel: 'Ajouter une langue',
    model: 'language',
    label: 'Langues',
    singular: 'langue',
    orderBy: [{ position: 'asc' }, { id: 'asc' }],
    title: (i) => i.name,
    subtitle: (i) => i.level,
    badges: (i) => [i.rating ? `${i.rating} / 5` : null],
    fields: [
      { name: 'name', label: 'Langue', type: 'text', required: true },
      { name: 'rating', label: 'Niveau', type: 'select', number: true, options: LEVELS, default: '0', help: 'Affiché en points, comme sur le CV.' },
      { name: 'level', label: 'Précision (facultatif)', type: 'text', help: 'Ex. Langue maternelle, Courant' },
      visibleField,
      positionField,
    ],
    columns: [
      { label: 'Langue', value: (i) => i.name },
      { label: 'Niveau', value: (i) => (i.rating ? `${i.rating} / 5` : i.level) },
      { label: 'Ordre', value: (i) => String(i.position) },
    ],
  },

  interets: {
    addLabel: "Ajouter un centre d'intérêt",
    model: 'interest',
    label: "Centres d'intérêt",
    singular: "centre d'intérêt",
    orderBy: [{ position: 'asc' }, { id: 'asc' }],
    title: (i) => i.name,
    subtitle: () => '',
    badges: () => [],
    fields: [
      { name: 'name', label: "Centre d'intérêt", type: 'text', required: true },
      visibleField,
      positionField,
    ],
    columns: [
      { label: "Centre d'intérêt", value: (i) => i.name },
      { label: 'Ordre', value: (i) => String(i.position) },
    ],
  },
};

export function getResource(key) {
  return Object.prototype.hasOwnProperty.call(RESOURCES, key) ? RESOURCES[key] : null;
}
