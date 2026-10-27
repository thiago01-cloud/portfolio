import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }) {
  const profile = await prisma.profile.findUnique({ where: { id: 1 } });

  return (
    <>
      <a className="skip" href="#contenu">Aller au contenu</a>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Accueil">
          <span className="brand-mark">JL</span>
          <span className="brand-name">{profile?.fullName || 'Portfolio'}</span>
        </Link>
        <nav aria-label="Navigation principale">
          <Link href="/#projets">Projets</Link>
          <Link href="/#competences">Compétences</Link>
          <Link href="/#parcours">Parcours</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        {profile?.cvUrl ? (
          <a className="btn btn-small" href={profile.cvUrl} download>
            Télécharger le CV
          </a>
        ) : null}
      </header>
      <main id="contenu">{children}</main>
      <footer className="footer">
        <p>
          Conçu et développé par {profile?.fullName || 'Justin-Laurent NZENGUI-MAYOMBO'} avec Next.js, Prisma et
          PostgreSQL.
        </p>
        <p>By EasyX Corporate, JLNM 2026</p>
      </footer>
    </>
  );
}
