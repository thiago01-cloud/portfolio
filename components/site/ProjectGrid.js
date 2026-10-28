'use client';

import Link from 'next/link';
import { useState } from 'react';

const FILTERS = [
  ['all', 'Tous'],
  ['mobile', 'Mobile'],
  ['web', 'Web'],
  ['desktop', 'Desktop'],
];

function Logo({ project, size = 'md' }) {
  return (
    <span className={`plogo plogo-${size}`}>
      {project.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.logoUrl} alt={`Logo ${project.name}`} />
      ) : (
        <span>{project.name.slice(0, 2)}</span>
      )}
    </span>
  );
}

export default function ProjectGrid({ projects }) {
  const [filter, setFilter] = useState('all');
  const available = FILTERS.filter(([key]) => key === 'all' || projects.some((p) => p.platforms.includes(key)));
  const shown = projects.filter((p) => filter === 'all' || p.platforms.includes(filter));

  return (
    <>
      <div className="section-head">
        <div>
          <h2>Projets</h2>
          <p>
            {projects.length} application{projects.length > 1 ? 's' : ''} conçue{projects.length > 1 ? 's' : ''} et
            développée{projects.length > 1 ? 's' : ''} de bout en bout, chacune avec sa propre identité.
          </p>
        </div>
        <div className="filters" role="group" aria-label="Filtrer les projets">
          {available.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`chip${filter === key ? ' is-active' : ''}`}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="pgrid">
        {shown.map((p) => (
          <article
            key={p.id}
            id={p.slug}
            className={`pcard${p.featured ? ' featured' : ''}${p.cover ? ' has-cover' : ''}`}
            style={{ '--t': p.themeColor, '--a': p.accentColor }}
          >
            <div className="pcard-body">
              <div className="pcard-top">
                <Logo project={p} />
                <div>
                  <h3>{p.name}</h3>
                  {p.context ? <p className="pcard-context">{p.context}</p> : null}
                </div>
              </div>
              <p className="pcard-summary">{p.summary}</p>
              {p.features.length > 0 ? (
                <ul className="pcard-features">
                  {(p.featured ? p.features : p.features.slice(0, 3)).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              ) : null}
              <div className="pcard-foot">
                <ul className="pcard-stack" aria-label="Technologies">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <div className="pcard-meta">
                  <span className={`pstatus${p.status === 'production' ? ' live' : ''}`}>{p.statusLabel}</span>
                  <div className="pcard-actions">
                    <Link className="pcard-link" href={`/projets/${p.slug}`}>
                      Détails
                      <span className="sr-only"> du projet {p.name}</span>
                    </Link>
                    {p.demoUrl ? (
                      <a className="pcard-visit" href={p.demoUrl} target="_blank" rel="noopener noreferrer">
                        {p.visitLabel}
                        <span className="sr-only"> : {p.name} (nouvel onglet)</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="pcard-visual" aria-hidden="true">
              {p.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="pcard-cover" src={p.cover} alt="" loading="lazy" />
              ) : (
                <Logo project={p} size="xl" />
              )}
            </div>
          </article>
        ))}
      </div>
      {shown.length === 0 ? <p className="empty">Aucun projet dans cette catégorie.</p> : null}
    </>
  );
}
