'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav({ links }) {
  const pathname = usePathname();
  return (
    <nav className="admin-nav" aria-label="Menu d'administration">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link key={l.href} href={l.href} className={active ? 'is-active' : ''} aria-current={active ? 'page' : undefined}>
            <span>{l.label}</span>
            {l.count ? <span className="count">{l.count}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
