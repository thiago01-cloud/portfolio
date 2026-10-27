'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSession, destroySession, requireAdmin } from '@/lib/auth';
import { MAX_SCREENSHOTS, slugify } from '@/lib/format';
import { prisma } from '@/lib/prisma';
import { getResource } from '@/lib/resources';
import { isFile, removeFile, saveFile } from '@/lib/storage';

function refreshAll() {
  revalidatePath('/', 'layout');
}

/* ---------------- Connexion ---------------- */

export async function login(prevState, formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  if (!email || !password) return { error: 'Saisissez votre e-mail et votre mot de passe.', email };

  const admin = await prisma.admin.findUnique({ where: { email } });
  const ok = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
  if (!ok) return { error: 'E-mail ou mot de passe incorrect.', email };

  await createSession(admin);
  redirect('/admin');
}

export async function logout() {
  await destroySession();
  redirect('/admin/login');
}

export async function changePassword(prevState, formData) {
  const session = await requireAdmin();
  const current = String(formData.get('current') || '');
  const next = String(formData.get('next') || '');
  const confirm = String(formData.get('confirm') || '');

  if (next.length < 8) return { error: 'Le nouveau mot de passe doit faire au moins 8 caractères.' };
  if (next !== confirm) return { error: 'Les deux nouveaux mots de passe ne correspondent pas.' };

  const admin = await prisma.admin.findUnique({ where: { id: Number(session.sub) } });
  if (!admin || !(await bcrypt.compare(current, admin.passwordHash))) {
    return { error: 'Le mot de passe actuel est incorrect.' };
  }
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  return { ok: 'Mot de passe modifié.' };
}

/* ---------------- Rubriques (CRUD générique) ---------------- */

function readFields(fields, formData) {
  const data = {};
  for (const f of fields) {
    switch (f.type) {
      case 'checkbox':
        data[f.name] = formData.get(f.name) === 'on';
        break;
      case 'select':
        data[f.name] = f.number
          ? parseInt(String(formData.get(f.name) ?? '0'), 10) || 0
          : String(formData.get(f.name) ?? '').trim();
        break;
      case 'number': {
        const n = parseInt(String(formData.get(f.name) ?? ''), 10);
        data[f.name] = Number.isFinite(n) ? n : 0;
        break;
      }
      case 'multi':
        data[f.name] = formData.getAll(f.name).map(String).join(',');
        break;
      default:
        data[f.name] = String(formData.get(f.name) ?? '').trim();
    }
  }
  for (const f of fields) {
    if (f.type === 'slug') data[f.name] = slugify(data[f.name] || data[f.from]);
  }
  return data;
}

function validate(fields, data) {
  for (const f of fields) {
    if (f.required && (data[f.name] === '' || data[f.name] === undefined)) {
      return `Le champ « ${f.label} » est obligatoire.`;
    }
    if (f.type === 'slug' && !data[f.name]) return `Le champ « ${f.label} » est obligatoire.`;
  }
  return null;
}

function dbError(e) {
  if (e?.code === 'P2002') return 'Cette adresse de page est déjà utilisée par un autre élément.';
  console.error(e);
  return "L'enregistrement a échoué. Réessayez.";
}

export async function createItem(resourceKey, prevState, formData) {
  await requireAdmin();
  const res = getResource(resourceKey);
  if (!res) return { error: 'Rubrique inconnue.' };

  const data = readFields(res.fields, formData);
  const error = validate(res.fields, data);
  if (error) return { error };

  let created;
  try {
    created = await prisma[res.model].create({ data });
  } catch (e) {
    return { error: dbError(e) };
  }
  refreshAll();
  // Projet : on ouvre directement la fiche pour ajouter les images
  redirect(res.hasImages ? `/admin/${resourceKey}/${created.id}?cree=1` : `/admin/${resourceKey}`);
}

export async function updateItem(resourceKey, id, prevState, formData) {
  await requireAdmin();
  const res = getResource(resourceKey);
  if (!res) return { error: 'Rubrique inconnue.' };

  const data = readFields(res.fields, formData);
  const error = validate(res.fields, data);
  if (error) return { error };

  try {
    await prisma[res.model].update({ where: { id: Number(id) }, data });
  } catch (e) {
    return { error: dbError(e) };
  }
  refreshAll();
  redirect(`/admin/${resourceKey}`);
}

export async function deleteItem(resourceKey, id) {
  await requireAdmin();
  const res = getResource(resourceKey);
  if (!res) return;

  if (res.hasImages) {
    const images = await prisma.projectImage.findMany({ where: { projectId: Number(id) } });
    await Promise.all(images.map((img) => removeFile(img.url)));
    const project = await prisma.project.findUnique({ where: { id: Number(id) } });
    for (const key of ['logoUrl', 'webShotUrl', 'mobileShotUrl']) {
      if (project?.[key]) await removeFile(project[key]);
    }
  }
  await prisma[res.model].delete({ where: { id: Number(id) } });
  refreshAll();
  redirect(`/admin/${resourceKey}`);
}

export async function toggleVisible(resourceKey, id) {
  await requireAdmin();
  const res = getResource(resourceKey);
  if (!res) return;
  const item = await prisma[res.model].findUnique({ where: { id: Number(id) } });
  if (!item) return;
  await prisma[res.model].update({ where: { id: item.id }, data: { visible: !item.visible } });
  refreshAll();
}

/* ---------------- Images des projets ---------------- */

export async function uploadProjectImage(projectId, prevState, formData) {
  await requireAdmin();
  const file = formData.get('image');
  if (!isFile(file)) return { error: 'Choisissez une image.' };
  if (!String(file.type).startsWith('image/')) return { error: 'Seules les images sont acceptées (JPG, PNG, WebP).' };
  if (file.size > 4 * 1024 * 1024) return { error: "L'image doit faire moins de 4 Mo." };

  const id = Number(projectId);
  const count = await prisma.projectImage.count({ where: { projectId: id } });
  if (count >= MAX_SCREENSHOTS) {
    return { error: `Ce projet a déjà ${MAX_SCREENSHOTS} captures. Supprimez-en une pour en ajouter une autre.` };
  }

  const last = await prisma.projectImage.findFirst({ where: { projectId: id }, orderBy: { position: 'desc' } });
  const url = await saveFile(file, `projets/${id}`);
  await prisma.projectImage.create({
    data: {
      projectId: id,
      url,
      alt: String(formData.get('alt') || '').trim().slice(0, 500),
      position: last ? last.position + 1 : 0,
    },
  });
  refreshAll();
  return { ok: 'Capture ajoutée.' };
}

export async function updateImageAlt(imageId, formData) {
  await requireAdmin();
  await prisma.projectImage.update({
    where: { id: Number(imageId) },
    data: { alt: String(formData.get('alt') || '').trim().slice(0, 500) },
  });
  refreshAll();
}

export async function deleteProjectImage(imageId) {
  await requireAdmin();
  const img = await prisma.projectImage.findUnique({ where: { id: Number(imageId) } });
  if (!img) return;
  await removeFile(img.url);
  await prisma.projectImage.delete({ where: { id: img.id } });
  refreshAll();
}

export async function moveProjectImage(imageId, direction) {
  await requireAdmin();
  const img = await prisma.projectImage.findUnique({ where: { id: Number(imageId) } });
  if (!img) return;
  const images = await prisma.projectImage.findMany({
    where: { projectId: img.projectId },
    orderBy: [{ position: 'asc' }, { id: 'asc' }],
  });
  const index = images.findIndex((i) => i.id === img.id);
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= images.length) return;
  [images[index], images[target]] = [images[target], images[index]];
  await prisma.$transaction(
    images.map((i, pos) => prisma.projectImage.update({ where: { id: i.id }, data: { position: pos } }))
  );
  refreshAll();
}

/* ---------------- Profil ---------------- */

const PROFILE_FIELDS = [
  'fullName', 'headline', 'about',
  'email', 'phone', 'location', 'extra', 'linkedinUrl', 'githubUrl',
];

export async function updateProfile(prevState, formData) {
  await requireAdmin();
  const data = {};
  for (const key of PROFILE_FIELDS) data[key] = String(formData.get(key) ?? '').trim();
  if (!data.fullName) return { error: 'Le nom complet est obligatoire.' };

  const current = await prisma.profile.findUnique({ where: { id: 1 } });

  const photo = formData.get('photo');
  if (isFile(photo)) {
    if (!String(photo.type).startsWith('image/')) return { error: 'La photo doit être une image.' };
    data.photoUrl = await saveFile(photo, 'profil');
    if (current?.photoUrl) await removeFile(current.photoUrl);
  } else if (formData.get('removePhoto') === 'on') {
    if (current?.photoUrl) await removeFile(current.photoUrl);
    data.photoUrl = '';
  }

  const cv = formData.get('cv');
  if (isFile(cv)) {
    if (cv.type !== 'application/pdf') return { error: 'Le CV doit être un fichier PDF.' };
    data.cvUrl = await saveFile(cv, 'cv');
    if (current?.cvUrl?.startsWith('/uploads/') || current?.cvUrl?.includes('blob.vercel-storage.com')) {
      await removeFile(current.cvUrl);
    }
  }

  await prisma.profile.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
  refreshAll();
  return { ok: 'Profil enregistré.' };
}

/* ---------------- Messages ---------------- */

export async function toggleMessageRead(id) {
  await requireAdmin();
  const msg = await prisma.message.findUnique({ where: { id: Number(id) } });
  if (!msg) return;
  await prisma.message.update({ where: { id: msg.id }, data: { read: !msg.read } });
  revalidatePath('/admin', 'layout');
}

export async function deleteMessage(id) {
  await requireAdmin();
  await prisma.message.delete({ where: { id: Number(id) } });
  revalidatePath('/admin', 'layout');
}

/* ---------------- Logo d'un projet ---------------- */

export async function uploadProjectLogo(projectId, prevState, formData) {
  await requireAdmin();
  const file = formData.get('logo');
  if (!isFile(file)) return { error: 'Choisissez un fichier.' };
  if (!String(file.type).startsWith('image/')) return { error: 'Le logo doit être une image (PNG, SVG, JPG, WebP).' };
  if (file.size > 2 * 1024 * 1024) return { error: 'Le logo doit faire moins de 2 Mo.' };

  const project = await prisma.project.findUnique({ where: { id: Number(projectId) } });
  if (!project) return { error: 'Projet introuvable.' };
  const url = await saveFile(file, `projets/${project.id}/logo`);
  if (project.logoUrl) await removeFile(project.logoUrl);
  await prisma.project.update({ where: { id: project.id }, data: { logoUrl: url } });
  refreshAll();
  return { ok: 'Logo enregistré.' };
}

export async function removeProjectLogo(projectId) {
  await requireAdmin();
  const project = await prisma.project.findUnique({ where: { id: Number(projectId) } });
  if (!project?.logoUrl) return;
  await removeFile(project.logoUrl);
  await prisma.project.update({ where: { id: project.id }, data: { logoUrl: '' } });
  refreshAll();
}

/* ---------------- Captures de présentation (web et mobile) ---------------- */

const SHOT_FIELDS = { web: 'webShotUrl', mobile: 'mobileShotUrl' };

export async function uploadPresentationShot(projectId, kind, prevState, formData) {
  await requireAdmin();
  const field = SHOT_FIELDS[kind];
  if (!field) return { error: 'Type de capture inconnu.' };
  const file = formData.get('shot');
  if (!isFile(file)) return { error: 'Choisissez une image.' };
  if (!String(file.type).startsWith('image/')) return { error: 'Seules les images sont acceptées (JPG, PNG, WebP).' };
  if (file.size > 4 * 1024 * 1024) return { error: "L'image doit faire moins de 4 Mo." };

  const project = await prisma.project.findUnique({ where: { id: Number(projectId) } });
  if (!project) return { error: 'Projet introuvable.' };
  const url = await saveFile(file, `projets/${project.id}/presentation`);
  if (project[field]) await removeFile(project[field]);
  await prisma.project.update({ where: { id: project.id }, data: { [field]: url } });
  refreshAll();
  return { ok: kind === 'web' ? 'Capture web enregistrée.' : 'Capture mobile enregistrée.' };
}

export async function removePresentationShot(projectId, kind) {
  await requireAdmin();
  const field = SHOT_FIELDS[kind];
  if (!field) return;
  const project = await prisma.project.findUnique({ where: { id: Number(projectId) } });
  if (!project?.[field]) return;
  await removeFile(project[field]);
  await prisma.project.update({ where: { id: project.id }, data: { [field]: '' } });
  refreshAll();
}
