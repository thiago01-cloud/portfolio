import { prisma } from '@/lib/prisma';
import FormShell from '@/components/admin/FormShell';
import { updateProfile } from '../../actions';

const TEXT_FIELDS = [
  { name: 'fullName', label: 'Nom complet', required: true },
  { name: 'headline', label: 'Titre', help: 'Ex. Lead développeur web et mobile' },
  { name: 'about', label: "Phrase d'accroche", type: 'textarea', help: "Le texte « Profil » du CV, affiché dans l'en-tête du site" },
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'phone', label: 'Téléphone' },
  { name: 'location', label: 'Ville' },
  { name: 'extra', label: 'Informations complémentaires', help: 'Ex. Permis B' },
  { name: 'linkedinUrl', label: 'LinkedIn', type: 'url' },
  { name: 'githubUrl', label: 'GitHub', type: 'url' },
];

export default async function ProfilePage() {
  const p = (await prisma.profile.findUnique({ where: { id: 1 } })) || {};

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Profil</h1>
          <p>Informations personnelles, contacts et CV.</p>
        </div>
      </header>

      <section className="panel">
        <FormShell action={updateProfile}>
          <div className="fields">
            {TEXT_FIELDS.map((f) => (
              <div key={f.name} className={`field${f.type === 'textarea' ? ' field-wide' : ''}`}>
                <label htmlFor={f.name}>
                  {f.label}
                  {f.required ? <span className="req"> (obligatoire)</span> : null}
                </label>
                {f.type === 'textarea' ? (
                  <textarea id={f.name} name={f.name} rows={4} defaultValue={p[f.name] || ''} />
                ) : (
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type || 'text'}
                    defaultValue={p[f.name] || ''}
                    required={f.required}
                  />
                )}
                {f.help ? <small className="help">{f.help}</small> : null}
              </div>
            ))}

            <div className="field">
              <label htmlFor="photo">Photo</label>
              {p.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="profile-photo" src={p.photoUrl} alt="Photo actuelle" />
              ) : null}
              <input id="photo" name="photo" type="file" accept="image/*" />
              {p.photoUrl ? (
                <label className="inline-check">
                  <input type="checkbox" name="removePhoto" /> Retirer la photo
                </label>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="cv">CV (PDF)</label>
              {p.cvUrl ? (
                <a className="btn-link" href={p.cvUrl} target="_blank" rel="noreferrer">
                  Ouvrir le CV actuel
                </a>
              ) : null}
              <input id="cv" name="cv" type="file" accept="application/pdf" />
              <small className="help">Le nouveau fichier remplace l&apos;ancien.</small>
            </div>
          </div>
        </FormShell>
      </section>
    </>
  );
}
