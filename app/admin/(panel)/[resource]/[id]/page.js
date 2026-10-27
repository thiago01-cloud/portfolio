import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getResource } from '@/lib/resources';
import FieldInput from '@/components/admin/FieldInput';
import FormShell from '@/components/admin/FormShell';
import ConfirmButton from '@/components/admin/ConfirmButton';
import ImageManager from '@/components/admin/ImageManager';
import { deleteItem, updateItem } from '../../../actions';

export default async function EditItem({ params, searchParams }) {
  const { resource, id } = await params;
  const res = getResource(resource);
  const numericId = Number(id);
  if (!res || !Number.isInteger(numericId)) notFound();

  const item = await prisma[res.model].findUnique({
    where: { id: numericId },
    include: res.hasImages ? { images: { orderBy: [{ position: 'asc' }, { id: 'asc' }] } } : undefined,
  });
  if (!item) notFound();
  const justCreated = (await searchParams)?.cree === '1';

  return (
    <>
      <header className="admin-head">
        <div>
          <Link className="back" href={`/admin/${resource}`}>
            {res.label}
          </Link>
          <h1>{res.title(item)}</h1>
          {justCreated ? <p className="form-ok">Créé. Vous pouvez maintenant ajouter des images.</p> : null}
        </div>
        <div className="head-tools">
          {resource === 'projets' && item.visible ? (
            <Link className="btn-link" href={`/projets/${item.slug}`} target="_blank">
              Voir sur le site
            </Link>
          ) : null}
          <form action={deleteItem.bind(null, resource, item.id)}>
            <ConfirmButton message={`Supprimer définitivement « ${res.title(item)} » ?`} className="btn btn-danger">
              Supprimer
            </ConfirmButton>
          </form>
        </div>
      </header>

      {res.hasImages ? <ImageManager project={item} images={item.images} /> : null}

      <section className="panel">
        <h2 className="panel-title">Informations</h2>
        <FormShell
          action={updateItem.bind(null, resource, item.id)}
          footer={
            <Link className="btn-link" href={`/admin/${resource}`}>
              Annuler
            </Link>
          }
        >
          <div className="fields">
            {res.fields.map((f) => (
              <FieldInput key={f.name} field={f} value={item[f.name]} />
            ))}
          </div>
        </FormShell>
      </section>
    </>
  );
}
