import { prisma } from '@/lib/prisma';
import { formatPeriod, formatYears, splitLines, splitList, STATUS_LABELS, telHref, visitLabel } from '@/lib/format';
import ProjectGrid from '@/components/site/ProjectGrid';
import HeroShowcase from '@/components/site/HeroShowcase';
import ContactForm from '@/components/site/ContactForm';
import Dots from '@/components/site/Dots';

// « PostgreSQL (Neon) » → « PostgreSQL », « Next.js 16 » → « Next.js »
function techName(raw) {
  return raw.replace(/\(.*?\)/g, '').replace(/\s+\d+(\.\d+)*$/, '').trim();
}

export default async function HomePage() {
  const visible = { visible: true };
  const [profile, projects, experiences, educations, skills, languages, interests] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.project.findMany({
      where: visible,
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
      include: { images: { orderBy: { position: 'asc' }, take: 1 } },
    }),
    prisma.experience.findMany({ where: visible, orderBy: { startDate: 'desc' } }),
    prisma.education.findMany({ where: visible, orderBy: [{ endYear: 'desc' }, { startYear: 'desc' }] }),
    prisma.skill.findMany({ where: visible, orderBy: [{ position: 'asc' }, { id: 'asc' }] }),
    prisma.language.findMany({ where: visible, orderBy: [{ position: 'asc' }, { id: 'asc' }] }),
    prisma.interest.findMany({ where: visible, orderBy: [{ position: 'asc' }, { id: 'asc' }] }),
  ]);

  const p = profile || {};
  const nameParts = (p.fullName || '').split(' ');
  const firstName = nameParts.shift() || '';
  const lastName = nameParts.join(' ');

  const cards = projects.map((pr) => ({
    id: pr.id,
    slug: pr.slug,
    name: pr.name,
    shortLabel: pr.shortLabel,
    context: pr.context,
    summary: pr.summary,
    features: splitLines(pr.features),
    stack: splitList(pr.stack),
    platforms: splitList(pr.platforms),
    status: pr.status,
    statusLabel: STATUS_LABELS[pr.status] || pr.status,
    themeColor: pr.themeColor || '#206566',
    accentColor: pr.accentColor || '#8FD3CB',
    logoUrl: pr.logoUrl,
    featured: pr.featured,
    demoUrl: pr.demoUrl || null,
    visitLabel: visitLabel(pr.demoUrl),
    webShot: pr.webShotUrl || null,
    mobileShot: pr.mobileShotUrl || null,
    cover: pr.webShotUrl || pr.images[0]?.url || null,
  }));

  // Chiffres calculés depuis la base
  const firstYear = experiences.reduce((min, e) => {
    const y = parseInt(e.startDate, 10);
    return Number.isFinite(y) && y < min ? y : min;
  }, new Date().getFullYear());
  const years = new Date().getFullYear() - firstYear;
  const techCount = new Map();
  for (const pr of cards) {
    for (const t of new Set(pr.stack.map(techName))) techCount.set(t, (techCount.get(t) || 0) + 1);
  }
  const techs = [...techCount.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'fr'));
  const inProduction = cards.filter((c) => c.status === 'production').length;

  const stats = [
    years > 0 ? { value: `${years}`, label: `ans d'expérience` } : null,
    { value: `${cards.length}`, label: `projet${cards.length > 1 ? 's' : ''} présenté${cards.length > 1 ? 's' : ''}` },
    { value: `${techs.length}`, label: 'technologies utilisées' },
    inProduction ? { value: `${inProduction}`, label: `en production` } : null,
  ].filter(Boolean);

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-intro">
            {p.headline ? <p className="hero-kicker">{p.headline}</p> : null}
            <h1>
              <span>{firstName}</span>
              <span className="hero-last">{lastName}</span>
            </h1>
            {p.about ? <p className="pitch">{p.about}</p> : null}
            <div className="hero-actions">
              <a className="btn btn-light" href="#projets">Voir les projets</a>
              <a className="btn btn-outline" href="#contact">Me contacter</a>
            </div>
          </div>
          <HeroShowcase projects={cards} />
        </div>

        <dl className="stats">
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="projets" className="section">
        <ProjectGrid projects={cards} />
      </section>

      <section id="competences" className="section">
        <div className="section-head">
          <div>
            <h2>Compétences</h2>
            <p>Savoir-faire, langues et technologies utilisées dans mes projets.</p>
          </div>
        </div>

        <div className="skills-grid">
          <div className="skill-card">
            <h3>Savoir-faire</h3>
            <ul className="levels">
              {skills.map((s) => (
                <li key={s.id}>
                  <span>{s.name}</span>
                  {s.level ? <Dots value={s.level} /> : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="skill-card">
            <h3>Langues</h3>
            <ul className="levels">
              {languages.map((l) => (
                <li key={l.id}>
                  <span>
                    {l.name}
                    {l.level ? <small> {l.level}</small> : null}
                  </span>
                  {l.rating ? <Dots value={l.rating} /> : null}
                </li>
              ))}
            </ul>
            {interests.length > 0 ? (
              <>
                <h3 className="sub">Centres d&apos;intérêt</h3>
                <ul className="tags">
                  {interests.map((i) => (
                    <li key={i.id}>{i.name}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          {techs.length > 0 ? (
            <div className="skill-card tech-card">
              <h3>Technologies de mes projets</h3>
              <ul className="tech-cloud">
                {techs.map(([name, count]) => (
                  <li key={name} className={count > 2 ? 'hot' : count > 1 ? 'warm' : ''}>
                    {name}
                    {count > 1 ? <span className="tech-count">{count} projets</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <section id="parcours" className="section">
        <div className="section-head">
          <div>
            <h2>Parcours</h2>
            <p>Expériences professionnelles et formation.</p>
          </div>
        </div>

        <div className="career">
          <ol className="timeline">
            {experiences.map((e) => (
              <li key={e.id} className={e.endDate ? '' : 'current'}>
                <p className="when">{formatPeriod(e.startDate, e.endDate)}</p>
                <h3>{e.title}</h3>
                <p className="org">
                  {e.company}
                  {e.location ? `, ${e.location}` : ''}
                </p>
                {e.description ? <p className="desc">{e.description}</p> : null}
              </li>
            ))}
          </ol>

          {educations.length > 0 ? (
            <aside className="edu">
              <h3>Formation</h3>
              <ul>
                {educations.map((ed) => (
                  <li key={ed.id}>
                    <span className="edu-years">{formatYears(ed.startYear, ed.endYear)}</span>
                    <strong>{ed.title}</strong>
                    <span className="edu-school">
                      {[ed.school, ed.location].filter(Boolean).join(', ')}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="contact-inner">
          <div>
            <h2>Un projet à construire ?</h2>
            <p>Application mobile, plateforme web ou back-office : parlons de ce que vous voulez lancer.</p>
            {p.email ? (
              <a className="mail" href={`mailto:${p.email}`}>
                {p.email}
              </a>
            ) : null}
            <ul className="contact-list">
              {p.phone ? (
                <li>
                  <a href={telHref(p.phone)}>{p.phone}</a>
                </li>
              ) : null}
              {p.location ? <li>{p.location}</li> : null}
              {p.linkedinUrl ? (
                <li>
                  <a href={p.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
                </li>
              ) : null}
              {p.githubUrl ? (
                <li>
                  <a href={p.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
                </li>
              ) : null}
              {p.cvUrl ? (
                <li>
                  <a href={p.cvUrl} download>Télécharger le CV (PDF)</a>
                </li>
              ) : null}
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
