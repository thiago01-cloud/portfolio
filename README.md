# Portfolio dynamique — Justin-Laurent NZENGUI-MAYOMBO

Next.js 15 (App Router) + Prisma. Site public alimenté par la base de données,
espace d'administration sur `/admin`. Chaque rubrique du CV est une table.

## Tables

| Table | Rubrique | Gérée dans |
| --- | --- | --- |
| `Profile` | Informations personnelles, profil, contacts, photo, CV PDF | /admin/profil |
| `Experience` | Expérience professionnelle | /admin/experiences |
| `Education` | Formation | /admin/formations |
| `Skill` | Compétences | /admin/competences |
| `Language` | Langues | /admin/langues |
| `Interest` | Centres d'intérêt | /admin/interets |
| `Project` + `ProjectImage` | Projets et captures d'écran | /admin/projets |
| `Message` | Messages du formulaire de contact | /admin/messages |
| `Admin` | Comptes d'administration | /admin/compte |

Les listes de l'admin s'affichent en **blocs** ou en **tableau** (bouton de bascule en haut à droite).
Chaque élément peut être masqué du site sans être supprimé.

## Base de données

PostgreSQL sur Neon, en production comme en local (`DATABASE_URL` et `DATABASE_URL_UNPOOLED`
dans `.env`, voir `.env.example`).

## Démarrage en local

```
npm install
npx prisma db push
npm run seed
npm run dev
```

- Site : http://localhost:3000
- Admin : http://localhost:3000/admin

`npm run seed` remplit la base avec le CV et les 7 projets. Il est relançable :
il ne remplit que les tables vides et complète les champs encore vides, sans rien écraser.

Sans `BLOB_READ_WRITE_TOKEN`, les images envoyées depuis l'admin vont dans `public/uploads`
(non versionné). Avec le jeton Blob dans `.env`, elles vont directement dans Vercel Blob.

## Déploiement (GitHub + Vercel + Neon + Blob)

1. Pousser le dossier `app` sur un dépôt GitHub, puis l'importer dans Vercel.
2. Dans le projet Vercel, onglet Storage : créer une base **Neon** et un store **Blob**,
   reliés au projet (Production, Preview, Development).
3. Variables d'environnement à ajouter : `AUTH_SECRET` (32 caractères minimum),
   `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
4. Sur le PC, avec les variables Neon dans `.env` : `npx prisma db push` puis `npm run seed`.
5. Redéployer depuis Vercel. Après chaque changement de `schema.prisma`, relancer
   `npx prisma db push` avant de pousser le code.

Limite Vercel : 4,5 Mo par envoi. Les images sont limitées à 4 Mo chacune.

## Structure

```
app/(site)/            site public : accueil, page projet, formulaire de contact
app/admin/login/       connexion
app/admin/(panel)/     administration (protégée par middleware.js)
app/admin/actions.js   toutes les actions serveur de l'admin
lib/resources.js       configuration des rubriques (champs, colonnes du tableau)
components/admin/      formulaires, bascule blocs/tableau, gestion des images
prisma/                schéma, données initiales (seed-data.js), seed.js
```

Ajouter une rubrique : créer le modèle dans `schema.prisma`, puis la déclarer dans
`lib/resources.js`. Le menu, la liste (blocs et tableau) et les formulaires suivent.

By EasyX Corporate, JLNM 2026
