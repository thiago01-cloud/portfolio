'use client';

import { useEffect, useRef, useState } from 'react';

function Placeholder({ p, compact }) {
  // Aperçu stylisé quand la capture réelle n'a pas encore été ajoutée
  return (
    <span className={`ph${compact ? ' ph-compact' : ''}`}>
      <span className="ph-logo">
        {p.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.logoUrl} alt="" />
        ) : (
          <span>{p.name.slice(0, 2)}</span>
        )}
      </span>
      <span className="ph-name">{p.name}</span>
      <span className="ph-ui" aria-hidden="true">
        <span className="ui-row ui-row-accent" />
        <span className="ui-row" />
        <span className="ui-row ui-row-short" />
        <span className="ui-tiles">
          <span />
          <span />
          <span />
        </span>
      </span>
    </span>
  );
}

// Vitrine de l'accueil : un écran d'ordinateur (version web) et un téléphone (version mobile)
// présentent chaque projet. Défilement automatique, en pause au survol ou au focus,
// désactivé si l'utilisateur préfère réduire les animations.
export default function HeroShowcase({ projects }) {
  const [active, setActive] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (projects.length < 2) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = setInterval(() => {
      if (!paused.current) setActive((i) => (i + 1) % projects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [projects.length]);

  if (projects.length === 0) return null;
  const p = projects[active];

  return (
    <div
      className="showcase"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <a className="device-stage" href={`#${p.slug}`} style={{ '--t': p.themeColor, '--a': p.accentColor }} aria-label={`Voir le projet ${p.name}`}>
        <span className="browser">
          <span className="browser-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span className="browser-url">{p.name}</span>
          </span>
          <span className="browser-screen" key={`w-${p.slug}`}>
            {p.webShot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.webShot} alt={`${p.name}, version web`} />
            ) : (
              <Placeholder p={p} />
            )}
          </span>
        </span>

        <span className="phone">
          <span className="phone-notch" aria-hidden="true" />
          <span className="phone-screen" key={`m-${p.slug}`}>
            {p.mobileShot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.mobileShot} alt={`${p.name}, version mobile`} />
            ) : (
              <Placeholder p={p} compact />
            )}
          </span>
        </span>
      </a>

      <p className="showcase-caption" aria-live="polite">
        <strong>{p.name}</strong>
        {p.shortLabel ? <span>{p.shortLabel}</span> : null}
      </p>

      <div className="picker" role="group" aria-label="Choisir un projet à afficher">
        {projects.map((x, i) => (
          <button
            key={x.slug}
            type="button"
            className={`pick${i === active ? ' is-active' : ''}`}
            style={{ '--t': x.themeColor }}
            aria-pressed={i === active}
            aria-label={x.name}
            title={x.name}
            onClick={() => setActive(i)}
          >
            {x.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={x.logoUrl} alt="" />
            ) : (
              <span>{x.name.slice(0, 2)}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
