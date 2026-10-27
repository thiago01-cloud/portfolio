// Stockage des fichiers : Vercel Blob si BLOB_READ_WRITE_TOKEN est défini,
// sinon dossier public/uploads (développement local).
import { put, del } from '@vercel/blob';
import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';

export function isFile(value) {
  return value && typeof value === 'object' && typeof value.arrayBuffer === 'function' && value.size > 0;
}

export async function saveFile(file, folder) {
  if (!isFile(file)) return null;
  const ext = (file.name?.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(name, file, { access: 'public', contentType: file.type || undefined });
    return blob.url;
  }

  const target = path.join(process.cwd(), 'public', 'uploads', name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function removeFile(url) {
  if (!url) return;
  try {
    if (url.startsWith('/uploads/')) {
      await unlink(path.join(process.cwd(), 'public', url));
    } else if (process.env.BLOB_READ_WRITE_TOKEN && url.includes('blob.vercel-storage.com')) {
      await del(url);
    }
  } catch {
    // Fichier déjà absent : rien à faire
  }
}
