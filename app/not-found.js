import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="notfound">
      <h1>Page introuvable</h1>
      <p>Cette page n&apos;existe pas ou a été retirée.</p>
      <Link className="btn" href="/">
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
