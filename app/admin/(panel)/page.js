import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDateTime } from '@/lib/format';
import { RESOURCES } from '@/lib/resources';

export default async function Dashboard() {
  const counts = await Promise.all(
    Object.entries(RESOURCES).map(async ([key, r]) => ({
      key,
      label: r.label,
      total: await prisma[r.model].count(),
      hidden: await prisma[r.model].count({ where: { visible: false } }),
    }))
  );
  const [imageCount, unread, latest] = await Promise.all([
    prisma.projectImage.count(),
    prisma.message.count({ where: { read: false } }),
    prisma.message.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Tableau de bord</h1>
          <p>Tout ce qui est publié sur votre portfolio.</p>
        </div>
      </header>

      <div className="tiles">
        {counts.map((c) => (
          <Link key={c.key} href={`/admin/${c.key}`} className="tile">
            <span className="tile-num">{c.total}</span>
            <span className="tile-label">{c.label}</span>
            {c.hidden > 0 ? <span className="tile-note">{c.hidden} masqué{c.hidden > 1 ? 's' : ''}</span> : null}
          </Link>
        ))}
        <Link href="/admin/projets" className="tile">
          <span className="tile-num">{imageCount}</span>
          <span className="tile-label">Captures d&apos;écran</span>
        </Link>
        <Link href="/admin/messages" className={`tile${unread ? ' tile-alert' : ''}`}>
          <span className="tile-num">{unread}</span>
          <span className="tile-label">Message{unread > 1 ? 's' : ''} non lu{unread > 1 ? 's' : ''}</span>
        </Link>
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>Derniers messages</h2>
          <Link href="/admin/messages">Tous les messages</Link>
        </div>
        {latest.length === 0 ? (
          <p className="muted">Aucun message pour l&apos;instant. Ils arriveront ici depuis le formulaire de contact du site.</p>
        ) : (
          <ul className="msg-mini">
            {latest.map((m) => (
              <li key={m.id} className={m.read ? '' : 'unread'}>
                <strong>{m.name}</strong>
                <span>{m.subject || m.body.slice(0, 80)}</span>
                <time>{formatDateTime(m.createdAt)}</time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
