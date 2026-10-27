import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getResource } from '@/lib/resources';
import FieldInput from '@/components/admin/FieldInput';
import FormShell from '@/components/admin/FormShell';
import { createItem } from '../../../actions';

export default async function NewItem({ params }) {
  const { resource } = await params;
  const res = getResource(resource);
  if (!res) notFound();

  return (
    <>
      <header className="admin-head">
        <div>
          <Link className="back" href={`/admin/${resource}`}>
            {res.label}
          </Link>
          <h1>{res.addLabel}</h1>
          {res.hasImages ? <p>Les images s&apos;ajoutent juste après l&apos;enregistrement.</p> : null}
        </div>
      </header>
      <FormShell
        action={createItem.bind(null, resource)}
        submitLabel="Créer"
        footer={
          <Link className="btn-link" href={`/admin/${resource}`}>
            Annuler
          </Link>
        }
      >
        <div className="fields">
          {res.fields.map((f) => (
            <FieldInput key={f.name} field={f} />
          ))}
        </div>
      </FormShell>
    </>
  );
}
