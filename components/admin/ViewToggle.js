import Link from 'next/link';

// Bascule Blocs / Tableau, mémorisée dans l'URL (?vue=tableau)
export default function ViewToggle({ basePath, view }) {
  return (
    <div className="view-toggle" role="group" aria-label="Affichage">
      <Link href={basePath} className={view === 'blocs' ? 'is-active' : ''} aria-current={view === 'blocs' ? 'true' : undefined}>
        Blocs
      </Link>
      <Link
        href={`${basePath}?vue=tableau`}
        className={view === 'tableau' ? 'is-active' : ''}
        aria-current={view === 'tableau' ? 'true' : undefined}
      >
        Tableau
      </Link>
    </div>
  );
}

export function readView(searchParams) {
  return searchParams?.vue === 'tableau' ? 'tableau' : 'blocs';
}
