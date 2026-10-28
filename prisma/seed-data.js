// Données initiales du portfolio (CV + projets). Utilisées par prisma/seed.js
// By EasyX Corporate, JLNM 2026

const profile = {
  fullName: 'Justin-Laurent NZENGUI-MAYOMBO',
  headline: 'Lead développeur web et mobile',
  about:
    "Spécialisé en développement et en gestion de projets technologiques, je maîtrise l'intégration de services applicatifs complexes sur des plateformes variées.",
  email: 'nzenguijustinlaurent@gmail.com',
  phone: '074 58 24 42',
  location: 'Libreville, Gabon',
  extra: 'Permis B',
  cvUrl: '/CV_NZENGUI_MAYOMBO_Lead_Dev.pdf',
};

const experiences = [
  {
    title: 'Chef de département Innovation technologique (IT)',
    company: 'GAM Gabon',
    location: 'Libreville',
    startDate: '2022-04',
    endDate: '',
    description:
      "Responsable d'une équipe de quatre techniciens en développement d'applications et infrastructures réseau. Mises à jour de GamPay et intégration de l'ensemble de ses services sur un GAB.",
  },
  {
    title: 'Développeur web et mobile',
    company: 'GAM Gabon',
    location: 'Libreville',
    startDate: '2022-02',
    endDate: '2022-04',
    description:
      'Développement de GamPay, application mobile grand public (crédit de communication, transferts locaux et internationaux, recharge de cartes Visa prépayées, forfaits internet), et de son back-office web.',
  },
  {
    title: 'Développeur web',
    company: 'Buisson Ardant Technologies',
    location: 'Libreville',
    startDate: '2021-08',
    endDate: '2021-11',
    description: 'Sites, applications et maintenance informatique pour les clients de la startup.',
  },
  {
    title: 'Développeur web et mobile',
    company: 'CKDO 027 Angondjé (groupe CKGADIS)',
    location: 'Libreville',
    startDate: '2020-07',
    endDate: '2021-03',
    description: 'Application de suivi des dates limites de vente (DLV) des produits du magasin.',
  },
  {
    title: 'Développeur web',
    company: 'Brain 4 Chievement',
    location: 'Libreville',
    startDate: '2018-02',
    endDate: '2020-01',
    description:
      'Applications web et mobiles pour une startup à impact sociétal spécialisée dans les TIC.',
  },
];

const educations = [
  {
    title: "Licence professionnelle en développement d'applications réparties",
    school: 'INPTIC',
    location: 'Libreville',
    startYear: 2020,
    endYear: 2021,
  },
  {
    title: "Diplôme de technicien supérieur en développement d'applications réparties",
    school: 'INPTIC',
    location: 'Libreville',
    startYear: 2019,
    endYear: 2020,
  },
  {
    title: 'Baccalauréat série D',
    school: 'Lycée national Léon Mba',
    location: 'Libreville',
    startYear: 2017,
    endYear: 2017,
  },
];

// Niveaux sur 5, repris du CV
const skills = [
  { name: 'Développement web', level: 5 },
  { name: 'Développement mobile', level: 5 },
  { name: 'Développement desktop', level: 5 },
  { name: 'Gestion de projets', level: 4 },
  { name: "Gestion d'infrastructures réseau", level: 3 },
  { name: 'Marketing et communication', level: 3 },
];

const languages = [
  { name: 'Français', level: '', rating: 5 },
  { name: 'Anglais', level: '', rating: 2 },
  { name: 'Anglais technique', level: '', rating: 3 },
];

const interests = ['Football', 'Randonnée'];

const projects = [
  {
    slug: 'gampay',
    name: 'GamPay',
    shortLabel: 'Mobile, en production',
    context: 'GAM Gabon, depuis 2022',
    summary:
      "Application grand public pour les opérations numériques du quotidien : crédit de communication, forfaits internet, transferts d'argent locaux et internationaux, recharge de cartes Visa prépayées.",
    features: [
      "Launcher Android complet : écran d'accueil personnalisable, fonds d'écran locaux ou en ligne",
      'Gestion des appels en temps réel en code natif Kotlin, reliée à Flutter par MethodChannel et EventChannel',
      'Packs smartphones « gam_phone » avec recharges obligatoirement via GamPay',
      'Intégration de l’ensemble des services GamPay sur un guichet automatique (GAB)',
      'Back-office web pour la gestion des services et de la clientèle',
    ].join('\n'),
    stack: 'Flutter, Kotlin, Laravel, Firebase, FCM',
    platforms: 'mobile,web',
    status: 'production',
    themeColor: '#212332',
    accentColor: '#FF6400',
    logoUrl: '/projets/gampay/logo.png',
    demoUrl: 'https://play.google.com/store/apps/details?id=com.gampay.gam&hl=fr',
    featured: true,
  },
  {
    slug: 'diong',
    name: 'Diong',
    shortLabel: 'PWA mariage',
    context: 'EasyX Corporate, 2026. « Diong » signifie « mariage » en isango.',
    summary:
      "Plateforme de gestion complète des mariages au Gabon. Elle rappelle les coutumes de chaque ethnie et budgétise le projet de A à Z, de la liste de la dot jusqu'à la soirée.",
    features: [
      'Cérémonial coutumier par ethnie, construit par des référents ethniques, et modèles de liste de dot',
      'Formats classique, combiné ou personnalisé, budget par poste et comités',
      'Cotisations des deux familles : engagements financiers et matériels, relances',
      "Billets d'invitation et contrôle à l'entrée entièrement hors connexion, synchronisé au retour du réseau",
    ].join('\n'),
    stack: 'Next.js 16, PWA, Prisma, PostgreSQL (Neon), Vercel, Web Push',
    platforms: 'web,mobile',
    status: 'development',
    themeColor: '#6B1430',
    accentColor: '#C9A24B',
    logoUrl: '/projets/diong/logo.png',
    featured: true,
  },
  {
    slug: 'suivi',
    name: 'SUIVI',
    shortLabel: 'Santé, web et mobile',
    context: 'EasyX Corporate, 2026. Testé avec des médecins.',
    summary:
      'Remplace la fiche papier de suivi du patient hospitalisé. Le médecin qui prend la relève retrouve tout ce que son collègue a fait.',
    features: [
      "Vue de relève : jours d'hospitalisation, constantes en courbes, examens, traitement",
      'Multi-établissements : structure, service, chambre, lit',
      'Saisie vocale des paramètres pour les infirmières',
    ].join('\n'),
    stack: 'Next.js, Flutter, Prisma, PostgreSQL',
    platforms: 'web,mobile',
    status: 'development',
    themeColor: '#0E5E66',
    accentColor: '#1FA58F',
    logoUrl: '/projets/suivi/logo.svg',
  },
  {
    slug: 'wedding-tickets',
    name: 'Wedding Tickets',
    shortLabel: 'Billets QR',
    context: 'EasyX Corporate, 2026',
    summary:
      "Billets d'invitation pour mariages : liste des invités, plan de table, billets QR en PDF et contrôleurs à l'entrée.",
    features: [
      'Génération des billets PDF avec QR code',
      "Scan à l'entrée depuis le navigateur du téléphone",
      'Espace contrôleurs avec rôles',
    ].join('\n'),
    stack: 'Next.js, Prisma, PostgreSQL, React PDF, ZXing',
    platforms: 'web',
    status: 'development',
    themeColor: '#4A2B4F',
    accentColor: '#BD91B7',
    logoUrl: '/projets/wedding-tickets/logo.svg',
  },
  {
    slug: 'stockit',
    name: 'StockIt',
    shortLabel: 'Stock et ventes',
    context: 'EasyX Corporate',
    summary:
      "Gestion de stock et de ventes pour boutiques d'électronique : ordinateurs, smartphones, téléviseurs et accessoires.",
    features: [
      'Stocks par rayon, pièces détaillées et mouvements',
      'Ventes, factures imprimables en PDF, fiches clients',
      "Boutiques, utilisateurs et droits d'accès",
    ].join('\n'),
    stack: 'Flutter (web, Android, desktop), Firebase, Firestore',
    platforms: 'mobile,web,desktop',
    status: 'development',
    themeColor: '#1A1C2B',
    accentColor: '#D9A86C',
    logoUrl: '/projets/stockit/logo.png',
  },
  {
    slug: 'tasks',
    name: 'TASKS',
    shortLabel: 'Gestion de tâches',
    context: 'EasyX Corporate, 2026',
    summary:
      "Gestion de tâches pour entreprises : créer, assigner et suivre le travail des équipes, sans la lourdeur d'un outil de gestion de projet.",
    features: [
      'Multi-entreprises, rôles propriétaire, admin, manager et agent',
      'Statuts, priorités, échéances, groupes de tâches',
      'Notifications push et e-mail',
    ].join('\n'),
    stack: 'Next.js, Flutter, Prisma, PostgreSQL, Resend',
    platforms: 'web,mobile',
    status: 'development',
    themeColor: '#2A3365',
    accentColor: '#F59E0B',
    logoUrl: '/projets/tasks/logo.png',
  },
  {
    slug: 'houses',
    name: 'Houses',
    shortLabel: 'Immobilier',
    context: 'EasyX Corporate, 2026',
    summary:
      "Gestion d'agences immobilières : biens, clients, contrats et tableau de bord, avec plusieurs agents qui travaillent à distance.",
    features: [
      'Un compte peut posséder plusieurs agences, données cloisonnées par agence',
      'Connexion par numéro de téléphone',
      'Biens avec photos, clients acheteurs, locataires, propriétaires',
    ].join('\n'),
    stack: 'Next.js, Prisma, PostgreSQL (Neon), Vercel',
    platforms: 'web',
    status: 'development',
    themeColor: '#163A30',
    accentColor: '#B6893C',
    logoUrl: '/projets/houses/logo.svg',
  },
  {
    slug: 'rendu-money',
    name: 'Rendu Money',
    shortLabel: 'Monnaie via mobile money',
    context: '',
    summary:
      'Rendu de monnaie digital via mobile money (Airtel Money et Moov Money) : le service pallie la pénurie de petite monnaie dans les commerces et les grandes surfaces.',
    features: [
      'Le commerçant rend la monnaie directement sur le compte Airtel Money ou Moov Money du client',
      'Pensé pour les commerces et grandes surfaces : pharmacies, Prix Import, Ali Bon Prix…',
      'Application mobile Flutter reliée à un back-office Laravel',
    ].join('\n'),
    stack: 'Flutter, Laravel, Airtel Money, Moov Money',
    platforms: 'mobile,web',
    status: 'development',
    themeColor: '#0B3D5C',
    accentColor: '#00A5F0',
    logoUrl: '/projets/rendu-money/logo.svg',
    demoUrl: 'https://play.google.com/store/apps/details?id=com.gampay.gam&hl=fr',
  },
  {
    slug: 'campagnes-whatsapp-sms',
    name: 'Campagnes WhatsApp et SMS',
    shortLabel: 'Communication client',
    context: '',
    summary:
      'Campagnes de communication par WhatsApp et SMS : envoi de messages modèles WhatsApp à une liste de clients, suivi des réactions et traitement des réponses.',
    features: [
      'Envoi de messages modèles (templates) WhatsApp vers une liste de clients',
      'Campagnes par SMS',
      'Suivi des réactions des destinataires',
      'Traitement des réponses des clients',
    ].join('\n'),
    stack: 'Laravel, WhatsApp Business, SMS',
    platforms: 'web',
    status: 'development',
    themeColor: '#075E54',
    accentColor: '#25D366',
    logoUrl: '/projets/campagnes-whatsapp-sms/logo.svg',
    demoUrl: 'https://gampay.org/services/public/login',
  },
];

// Images fournies avec le projet (copiées dans public/projets)
const projectImages = {
  'wedding-tickets': [{ url: '/projets/wedding-tickets/billet.jpg', alt: "Fond du billet d'invitation" }],
};

module.exports = { projectImages, profile, experiences, educations, skills, languages, interests, projects };
