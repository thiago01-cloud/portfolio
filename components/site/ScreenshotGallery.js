'use client';

import { useEffect, useRef, useState } from 'react';

// Captures d'écran d'un projet (4 maximum), avec description et vue agrandie.
export default function ScreenshotGallery({ name, images }) {
  const [open, setOpen] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open !== null && !dialog.open) dialog.showModal();
    if (open === null && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, images.length]);

  if (images.length === 0) return null;
  const current = open !== null ? images[open] : null;

  return (
    <>
      <ol className={`shots shots-${images.length}`}>
        {images.map((img, i) => (
          <li key={img.id}>
            <button type="button" className="shot" onClick={() => setOpen(i)} aria-label={`Agrandir la capture ${i + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt || `${name}, capture ${i + 1}`} loading="lazy" />
            </button>
            {img.alt ? <p className="shot-desc">{img.alt}</p> : null}
          </li>
        ))}
      </ol>

      <dialog ref={dialogRef} className="lightbox" onClose={() => setOpen(null)} onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
        {current ? (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.url} alt={current.alt || `${name}, capture ${open + 1}`} />
            <figcaption>
              <span className="lb-count">
                {open + 1} / {images.length}
              </span>
              {current.alt ? <span>{current.alt}</span> : null}
            </figcaption>
          </figure>
        ) : null}
        <div className="lb-actions">
          {images.length > 1 ? (
            <>
              <button type="button" onClick={() => setOpen((i) => (i - 1 + images.length) % images.length)}>
                Précédente
              </button>
              <button type="button" onClick={() => setOpen((i) => (i + 1) % images.length)}>
                Suivante
              </button>
            </>
          ) : null}
          <button type="button" className="lb-close" onClick={() => setOpen(null)}>
            Fermer
          </button>
        </div>
      </dialog>
    </>
  );
}
