'use client';

import { useEffect, useState } from 'react';

// Onglets de la page projet : « Présentation » et « Histoire du projet ».
// L'onglet actif est repris de l'adresse (#histoire) pour pouvoir partager le lien.
export default function ProjectTabs({ presentation, story }) {
  const [tab, setTab] = useState('presentation');

  useEffect(() => {
    if (story && window.location.hash === '#histoire') setTab('histoire');
  }, [story]);

  if (!story) return presentation;

  const select = (next) => {
    setTab(next);
    try {
      window.history.replaceState(null, '', next === 'histoire' ? '#histoire' : window.location.pathname);
    } catch {
      // Sans effet si l'historique n'est pas disponible
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = tab === 'presentation' ? 'histoire' : 'presentation';
      select(next);
      document.getElementById(`tab-${next}`)?.focus();
    }
  };

  return (
    <div className="ptabs">
      <div className="ptabs-list" role="tablist" aria-label="Sections du projet">
        {[
          ['presentation', 'Présentation'],
          ['histoire', 'Histoire du projet'],
        ].map(([key, label]) => (
          <button
            key={key}
            id={`tab-${key}`}
            type="button"
            role="tab"
            aria-selected={tab === key}
            aria-controls={`panel-${key}`}
            tabIndex={tab === key ? 0 : -1}
            className={tab === key ? 'is-active' : ''}
            onClick={() => select(key)}
            onKeyDown={onKeyDown}
          >
            {label}
          </button>
        ))}
      </div>

      <div id="panel-presentation" role="tabpanel" aria-labelledby="tab-presentation" hidden={tab !== 'presentation'}>
        {presentation}
      </div>
      <div id="panel-histoire" role="tabpanel" aria-labelledby="tab-histoire" hidden={tab !== 'histoire'}>
        {story}
      </div>
    </div>
  );
}
