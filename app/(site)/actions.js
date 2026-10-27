'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

const clean = (v, max) => String(v ?? '').trim().slice(0, max);

export async function sendMessage(prevState, formData) {
  // Champ piège anti-robots : invisible pour les humains
  if (clean(formData.get('website'), 200)) return { ok: true };

  const data = {
    name: clean(formData.get('name'), 120),
    email: clean(formData.get('email'), 160),
    phone: clean(formData.get('phone'), 40),
    subject: clean(formData.get('subject'), 160),
    body: clean(formData.get('body'), 5000),
  };

  if (!data.name) return { error: 'Indiquez votre nom.', values: data };
  if (!data.email && !data.phone) {
    return { error: 'Indiquez un e-mail ou un téléphone pour que je puisse vous répondre.', values: data };
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { error: "L'adresse e-mail n'est pas valide.", values: data };
  }
  if (data.body.length < 10) return { error: 'Votre message est trop court.', values: data };

  await prisma.message.create({ data });
  revalidatePath('/admin', 'layout');
  return { ok: true };
}
