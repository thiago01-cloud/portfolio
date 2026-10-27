import FormShell from './FormShell';
import ConfirmButton from './ConfirmButton';
import SubmitButton from './SubmitButton';
import { MAX_SCREENSHOTS } from '@/lib/format';
import {
  deleteProjectImage,
  moveProjectImage,
  removePresentationShot,
  removeProjectLogo,
  updateImageAlt,
  uploadProjectImage,
  uploadPresentationShot,
  uploadProjectLogo,
} from '@/app/admin/actions';

// Logo et captures d'écran d'un projet (4 maximum, chacune avec une description facultative).
// La première capture sert de couverture sur l'accueil.
export default function ImageManager({ project, images }) {
  const projectId = project.id;
  return (
    <>
    <section className="panel logo-panel">
      <h2 className="panel-title">Logo</h2>
      <div className="logo-row">
        <div className="logo-preview" style={{ background: project.themeColor }}>
          {project.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.logoUrl} alt={`Logo ${project.name}`} />
          ) : (
            <span>{project.name.slice(0, 2)}</span>
          )}
        </div>
        <div className="logo-forms">
          <FormShell action={uploadProjectLogo.bind(null, projectId)} submitLabel={project.logoUrl ? 'Remplacer le logo' : 'Ajouter le logo'}>
            <div className="field">
              <label htmlFor="logo">Image du logo (PNG ou SVG de préférence, carré, 2 Mo maximum)</label>
              <input id="logo" name="logo" type="file" accept="image/*" />
            </div>
          </FormShell>
          {project.logoUrl ? (
            <form action={removeProjectLogo.bind(null, projectId)}>
              <ConfirmButton message="Retirer le logo de ce projet ?">Retirer le logo</ConfirmButton>
            </form>
          ) : null}
        </div>
      </div>
    </section>

    <section className="panel">
      <h2 className="panel-title">Présentation sur l&apos;accueil</h2>
      <p className="muted">
        Une capture de la version web et une de la version mobile. Elles s&apos;affichent dans l&apos;écran
        d&apos;ordinateur et le téléphone de la vitrine, en haut de la page d&apos;accueil.
      </p>
      <div className="present-slots">
        {[
          ['web', 'Version web', 'webShotUrl', "Format paysage, idéalement 1440 × 900 (capture d'écran du navigateur)."],
          ['mobile', 'Version mobile', 'mobileShotUrl', 'Format portrait, idéalement 1080 × 2160 (capture du téléphone).'],
        ].map(([kind, label, field, hint]) => (
          <div key={kind} className={`present-slot present-${kind}`}>
            <h3>{label}</h3>
            <div className="present-frame" style={{ background: project.themeColor }}>
              {project[field] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project[field]} alt={`${project.name}, ${label.toLowerCase()}`} />
              ) : (
                <span>Aucune capture</span>
              )}
            </div>
            <FormShell
              action={uploadPresentationShot.bind(null, projectId, kind)}
              submitLabel={project[field] ? 'Remplacer' : 'Ajouter'}
            >
              <div className="field">
                <label htmlFor={`shot-${kind}`}>{hint}</label>
                <input id={`shot-${kind}`} name="shot" type="file" accept="image/*" required />
              </div>
            </FormShell>
            {project[field] ? (
              <form action={removePresentationShot.bind(null, projectId, kind)}>
                <ConfirmButton message={`Retirer la capture ${label.toLowerCase()} ?`}>Retirer</ConfirmButton>
              </form>
            ) : null}
          </div>
        ))}
      </div>
    </section>

    <section className="panel">
      <div className="panel-head">
        <h2 className="panel-title">Captures d&apos;écran</h2>
        <span className="badge">
          {images.length} / {MAX_SCREENSHOTS}
        </span>
      </div>
      <p className="muted">
        Jusqu&apos;à {MAX_SCREENSHOTS} captures supplémentaires, chacune avec une description facultative. Elles
        s&apos;affichent sur la page du projet.
      </p>

      <ol className="slots">
        {images.map((img, index) => (
          <li key={img.id} className="slot filled">
            <div className="slot-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt || `Capture ${index + 1}`} />
              <span className="badge slot-num">Capture {index + 1}</span>
            </div>
            <form action={updateImageAlt.bind(null, img.id)} className="slot-desc">
              <label htmlFor={`alt-${img.id}`}>Description (facultative)</label>
              <textarea id={`alt-${img.id}`} name="alt" rows={3} defaultValue={img.alt} maxLength={500} placeholder="Ex. Écran d'accueil avec le solde et les services" />
              <SubmitButton pendingText="Enregistrement…">Enregistrer la description</SubmitButton>
            </form>
            <div className="img-actions">
              {index > 0 ? (
                <form action={moveProjectImage.bind(null, img.id, 'up')}>
                  <SubmitButton>Avancer</SubmitButton>
                </form>
              ) : null}
              {index < images.length - 1 ? (
                <form action={moveProjectImage.bind(null, img.id, 'down')}>
                  <SubmitButton>Reculer</SubmitButton>
                </form>
              ) : null}
              <form action={deleteProjectImage.bind(null, img.id)}>
                <ConfirmButton message="Supprimer cette capture ?">Supprimer</ConfirmButton>
              </form>
            </div>
          </li>
        ))}

        {Array.from({ length: Math.max(0, MAX_SCREENSHOTS - images.length) }, (_, i) => {
          const slot = images.length + i + 1;
          return (
            <li key={`empty-${slot}`} className="slot empty">
              <FormShell action={uploadProjectImage.bind(null, projectId)} submitLabel="Ajouter">
                <p className="slot-title">Emplacement {slot} libre</p>
                <div className="field">
                  <label htmlFor={`image-${slot}`}>Image (JPG, PNG ou WebP, 4 Mo maximum)</label>
                  <input id={`image-${slot}`} name="image" type="file" accept="image/*" required />
                </div>
                <div className="field">
                  <label htmlFor={`alt-new-${slot}`}>Description (facultative)</label>
                  <textarea id={`alt-new-${slot}`} name="alt" rows={2} maxLength={500} />
                </div>
              </FormShell>
            </li>
          );
        })}
      </ol>
    </section>
    </>
  );
}
