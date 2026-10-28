// Nombre maximum de captures d'écran par projet
export const MAX_SCREENSHOTS = 4;

const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

export const STATUS_LABELS = {
  production: 'En production',
  development: 'En développement',
  paused: 'En pause',
};

export const PLATFORM_LABELS = { web: 'Web', mobile: 'Mobile', desktop: 'Desktop' };

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function parseMonth(value) {
  const m = /^(\d{4})-(\d{2})$/.exec(value || '');
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]) - 1 };
}

export function formatMonth(value) {
  const d = parseMonth(value);
  return d ? `${MONTHS[d.month]} ${d.year}` : '';
}

// « Avril 2022, aujourd'hui » · « Février à avril 2022 » · « Juillet 2020 à mars 2021 »
export function formatPeriod(start, end) {
  const s = parseMonth(start);
  if (!s) return '';
  const e = parseMonth(end);
  if (!e) return `${cap(MONTHS[s.month])} ${s.year}, aujourd'hui`;
  if (s.year === e.year) {
    if (s.month === e.month) return `${cap(MONTHS[s.month])} ${s.year}`;
    return `${cap(MONTHS[s.month])} à ${MONTHS[e.month]} ${e.year}`;
  }
  return `${cap(MONTHS[s.month])} ${s.year} à ${MONTHS[e.month]} ${e.year}`;
}

export function formatYears(start, end) {
  if (!start && !end) return '';
  if (!start || start === end) return String(end || start);
  if (!end) return `depuis ${start}`;
  return `${start} à ${end}`;
}

// Découpe « Flutter (web, Android), Firebase » en ['Flutter (web, Android)', 'Firebase'] :
// les virgules entre parenthèses ne séparent pas.
export function splitList(value, sep = ',') {
  const out = [];
  let depth = 0;
  let current = '';
  for (const ch of value || '') {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === sep && depth === 0) {
      out.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out.map((s) => s.trim()).filter(Boolean);
}

export function splitLines(value) {
  return (value || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}

export function slugify(value) {
  return (value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDateTime(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Libreville',
  }).format(new Date(date));
}

export function telHref(phone) {
  return `tel:${(phone || '').replace(/[^\d+]/g, '')}`;
}

// Libellé du lien de visite selon sa cible
export function visitLabel(url) {
  if (!url) return '';
  if (/play\.google\.com/i.test(url)) return 'Voir sur Google Play';
  if (/apps\.apple\.com/i.test(url)) return "Voir sur l'App Store";
  return 'Visiter le site';
}
