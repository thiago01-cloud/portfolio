import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RESOURCES } from '@/lib/resources';
import ConfirmButton from '@/components/admin/ConfirmButton';
import AdminNav from '@/components/admin/AdminNav';
import { logout } from '../actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Administration du portfolio' };

export default async function PanelLayout({ children }) {
  const session = await requireAdmin();
  const unread = await prisma.message.count({ where: { read: false } });

  const links = [
    { href: '/admin', label: 'Tableau de bord', exact: true },
    { href: '/admin/profil', label: 'Profil' },
    ...Object.entries(RESOURCES).map(([key, r]) => ({ href: `/admin/${key}`, label: r.label })),
    { href: '/admin/messages', label: 'Messages', count: unread },
    { href: '/admin/compte', label: 'Mon compte' },
  ];

  return (
    <div className="admin">
      <aside className="admin-side">
        <Link className="monogram" href="/admin">
          JL<span>NM</span>
        </Link>
        <AdminNav links={links} />
        <div className="admin-side-foot">
          <Link href="/" target="_blank">
            Voir le site
          </Link>
          <p className="who">{session.name}</p>
          <form action={logout}>
            <ConfirmButton message="Voulez-vous vous déconnecter ?" className="btn-link light">
              Se déconnecter
            </ConfirmButton>
          </form>
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
