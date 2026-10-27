// Données initiales : CV de Justin-Laurent NZENGUI-MAYOMBO + projets du dossier projects.
// Relançable sans risque :
// - les tables vides sont remplies ;
// - les éléments déjà présents ne sont complétés que là où un champ est encore vide
//   (logo, couleurs, niveaux), jamais écrasés.
// By EasyX Corporate, JLNM 2026

require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const {
  profile,
  experiences,
  educations,
  skills,
  languages,
  interests,
  projects,
  projectImages,
} = require('./seed-data');

async function seedProjects() {
  for (const [i, p] of projects.entries()) {
    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });
    let project = existing;
    if (!existing) {
      project = await prisma.project.create({ data: { ...p, position: i } });
    } else {
      const patch = {};
      if (!existing.logoUrl) patch.logoUrl = p.logoUrl;
      if (!existing.themeColor || existing.themeColor === '#206566') patch.themeColor = p.themeColor;
      if (!existing.accentColor || existing.accentColor === '#1FA58F' || existing.accentColor === '#1C5D8A') {
        patch.accentColor = p.accentColor;
      }
      if (Object.keys(patch).length) project = await prisma.project.update({ where: { id: existing.id }, data: patch });
    }

    const images = projectImages[p.slug] || [];
    if (images.length && (await prisma.projectImage.count({ where: { projectId: project.id } })) === 0) {
      await prisma.projectImage.createMany({
        data: images.map((img, pos) => ({ ...img, projectId: project.id, position: pos })),
      });
    }
  }
}

async function main() {
  await prisma.profile.upsert({ where: { id: 1 }, update: {}, create: { id: 1, ...profile } });

  if ((await prisma.experience.count()) === 0) {
    await prisma.experience.createMany({ data: experiences });
  }
  if ((await prisma.education.count()) === 0) {
    await prisma.education.createMany({ data: educations });
  }

  if ((await prisma.skill.count()) === 0) {
    await prisma.skill.createMany({ data: skills.map((s, i) => ({ ...s, position: i })) });
  } else {
    for (const s of skills) {
      await prisma.skill.updateMany({ where: { name: s.name, level: 0 }, data: { level: s.level } });
    }
    // Ancien libellé de la première version
    await prisma.skill.updateMany({
      where: { name: 'Infrastructures réseau', level: 0 },
      data: { name: "Gestion d'infrastructures réseau", level: 3 },
    });
  }

  if ((await prisma.language.count()) === 0) {
    await prisma.language.createMany({ data: languages.map((l, i) => ({ ...l, position: i })) });
  } else {
    for (const l of languages) {
      await prisma.language.updateMany({ where: { name: l.name, rating: 0 }, data: { rating: l.rating } });
    }
  }

  if ((await prisma.interest.count()) === 0) {
    await prisma.interest.createMany({ data: interests.map((name, i) => ({ name, position: i })) });
  }

  await seedProjects();

  const email = (process.env.ADMIN_EMAIL || 'nzenguijustinlaurent@gmail.com').toLowerCase();
  const exists = await prisma.admin.findUnique({ where: { email } });
  if (!exists) {
    const password = process.env.ADMIN_PASSWORD || 'ChangeMoi123!';
    await prisma.admin.create({
      data: {
        name: process.env.ADMIN_NAME || 'Administrateur',
        email,
        passwordHash: await bcrypt.hash(password, 10),
      },
    });
    console.log(`Compte admin créé : ${email}`);
  }
  console.log('Données initiales en place.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
