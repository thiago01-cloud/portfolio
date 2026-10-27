import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getResource } from '@/lib/resources';
import ViewToggle, { readView } from '@/components/admin/ViewToggle';
import ConfirmButton from '@/components/admin/ConfirmButton';
import SubmitButton from '@/components/admin/SubmitButton';
import { deleteItem, toggleVisible } from '../../actions';

export default async function ResourceList({ params, searchParams }) {
  const { resource } = await params;
  const res = getResource(resource);
  if (!res) notFound();

  const view = readView(await searchParams);
  const items = await prisma[res.model].findMany({
    orderBy: res.orderBy,
    include: res.hasImages
      ? { images: { orderBy: { position: 'asc' }, take: 1 }, _count: { select: { images: true } } }
      : undefined,
  });
  const base = `/admin/${resource}`;

  const actions = (item) => (
    <div className="item-actions">
      <Link className="btn-link" href={`${base}/${item.id}`}>
        Modifier
      </Link>
      <form action={toggleVisible.bind(null, resource, item.id)}>
        <SubmitButton>{item.visible ? 'Masquer' : 'Afficher'}</SubmitButton>
      </form>
      <form action={deleteItem.bind(null, resource, item.id)}>
        <ConfirmButton message={`Supprimer définitivement « ${res.title(item)} » ?`}>Supprimer</ConfirmButton>
      </form>
    </div>
  );

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>{res.label}</h1>
          <p>
            {items.length} élément{items.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="head-tools">
          <ViewToggle basePath={base} view={view} />
          <Link className="btn" href={`${base}/nouveau`}>
            {res.addLabel}
          </Link>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Aucun élément pour l&apos;instant.</p>
          <Link className="btn" href={`${base}/nouveau`}>
            Ajouter le premier
          </Link>
        </div>
      ) : view === 'tableau' ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {res.columns.map((c) => (
                  <th key={c.label} scope="col">
                    {c.label}
                  </th>
                ))}
                <th scope="col">Site</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={item.visible ? '' : 'is-hidden'}>
                  {res.columns.map((c) => (
                    <td key={c.label}>{c.value(item)}</td>
                  ))}
                  <td>{item.visible ? 'Visible' : 'Masqué'}</td>
                  <td>{actions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cards">
          {items.map((item) => (
            <article
              key={item.id}
              className={`card${item.visible ? '' : ' is-hidden'}`}
              style={item.themeColor ? { '--accent': item.themeColor } : undefined}
            >
              {res.hasImages ? (
                item.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="card-img" src={item.images[0].url} alt="" />
                ) : item.logoUrl ? (
                  <div className="card-img logo-tile" style={{ background: item.themeColor }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.logoUrl} alt="" />
                  </div>
                ) : (
                  <div className="card-img placeholder">Aucune image</div>
                )
              ) : null}
              <div className="card-body">
                <h2>{res.title(item)}</h2>
                {res.subtitle(item) ? <p className="muted">{res.subtitle(item)}</p> : null}
                <div className="badges">
                  {res.badges(item).filter(Boolean).map((b) => (
                    <span key={b} className="badge">
                      {b}
                    </span>
                  ))}
                  {!item.visible ? <span className="badge badge-off">Masqué</span> : null}
                </div>
              </div>
              {actions(item)}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
