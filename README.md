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

## Démarrage en local (SQLite)

```
npm install
npx prisma db push
npm run seed
npm run dev
```

- Site : http://localhost:3000
- Admin : http://localhost:3000/admin
  (e-mail et mot de passe définis dans `.env` : `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
  Changez le mot de passe dans « Mon compte » après la première connexion.

`npm run seed` remplit la base avec le CV et les 7 projets. Il est relançable :
il ne remplit que les tables vides et ne touche pas à ce que vous avez modifié.

En local, les images envoyées depuis l'admin sont enregistrées dans `public/uploads`.

## Passage à Neon et déploiement sur Vercel

1. Dans `prisma/schema.prisma`, remplacer `provider = "sqlite"` par `provider = "postgresql"`.
   Le schéma n'utilise ni enum ni type spécifique : rien d'autre à changer.
2. Créer la base Neon (intégration Vercel Storage) : Vercel ajoute `DATABASE_URL`.
3. Créer un store **Vercel Blob** sur le projet : Vercel ajoute `BLOB_READ_WRITE_TOKEN`.
   Les images et le CV iront alors dans Blob.
4. Ajouter dans les variables d'environnement Vercel : `AUTH_SECRET` (longue chaîne aléatoire),
   `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
5. Depuis votre PC, avec la `DATABASE_URL` de Neon dans `.env` :
   `npx prisma db push` puis `npm run seed`.
6. Pousser sur GitHub ; Vercel construit avec `npm run build`.

Limite Vercel : 4,5 Mo par envoi. Les images sont donc limitées à 4 Mo chacune ;
envoyez-les une par une si elles sont lourdes.

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
"# portfolio" 
