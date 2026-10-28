import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MAX_SCREENSHOTS, PLATFORM_LABELS, splitLines, splitList, STATUS_LABELS, visitLabel } from '@/lib/format';
import ScreenshotGallery from '@/components/site/ScreenshotGallery';
import ProjectTabs from '@/components/site/ProjectTabs';

async function getProject(slug) {
  return prisma.project.findFirst({
    where: { slug, visible: true },
    include: { images: { orderBy: [{ position: 'asc' }, { id: 'asc' }], take: MAX_SCREENSHOTS } },
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return { title: `${project.name}, projet de Justin-Laurent NZENGUI-MAYOMBO`, description: project.summary };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const [prev, next] = await Promise.all([
    prisma.project.findFirst({
      where: { visible: true, position: { lt: project.position } },
      orderBy: [{ position: 'desc' }, { id: 'desc' }],
      select: { slug: true, name: true },
    }),
    prisma.project.findFirst({
      where: { visible: true, position: { gt: project.position } },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
      select: { slug: true, name: true },
    }),
  ]);

  const features = splitLines(project.features);
  const storyParagraphs = (project.story || '')
    .split(/\r?\n\s*\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
  const stack = splitList(project.stack);
  const platforms = splitList(project.platforms).map((x) => PLATFORM_LABELS[x] || x);

  return (
    <article className="project-page" style={{ '--t': project.themeColor, '--a': project.accentColor }}>
      <header className="project-hero">
        <div className="project-hero-inner">
          <Link className="back" href="/#projets">
            Tous les projets
          </Link>
          <div className="project-title">
            <span className="plogo plogo-lg">
              {project.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.logoUrl} alt={`Logo ${project.name}`} />
              ) : (
                <span>{project.name.slice(0, 2)}</span>
              )}
            </span>
            <div>
              <h1>{project.name}</h1>
              {project.context ? <p className="context">{project.context}</p> : null}
            </div>
          </div>
          <p className="lead">{project.summary}</p>
          <div className="facts">
            <span className={`pstatus${project.status === 'production' ? ' live' : ''}`}>
              {STATUS_LABELS[project.status] || project.status}
            </span>
            {platforms.length > 0 ? <span className="fact">{platforms.join(', ')}</span> : null}
            {project.demoUrl ? (
              <a className="btn btn-light btn-small" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                {visitLabel(project.demoUrl)}
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <div className="project-body">
        {project.webShotUrl || project.mobileShotUrl ? (
          <section className="project-present">
            <span className={`device-stage static${project.webShotUrl ? '' : ' no-web'}${project.mobileShotUrl ? '' : ' no-mobile'}`}>
              {project.webShotUrl ? (
                <span className="browser">
                  <span className="browser-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span className="browser-url">{project.name}</span>
                  </span>
                  <span className="browser-screen">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.webShotUrl} alt={`${project.name}, version web`} />
                  </span>
                </span>
              ) : null}
              {project.mobileShotUrl ? (
                <span className="phone">
                  <span className="phone-notch" aria-hidden="true" />
                  <span className="phone-screen">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.mobileShotUrl} alt={`${project.name}, version mobile`} />
                  </span>
                </span>
              ) : null}
            </span>
          </section>
        ) : null}

        <ProjectTabs
          presentation={
            <div className="ptab-presentation">
              <div className="project-details">
                {features.length > 0 ? (
                  <section>
                    <h2>Fonctionnalités clés</h2>
                    <ul className="feature-list">
                      {features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}
                {stack.length > 0 ? (
                  <section>
                    <h2>Technologies</h2>
                    <ul className="tags tags-project">
                      {stack.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>

              {project.images.length > 0 ? (
                <section>
                  <h2>Captures d&apos;écran</h2>
                  <ScreenshotGallery
                    name={project.name}
                    images={project.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt }))}
                  />
                </section>
              ) : null}
            </div>
          }
          story={
            storyParagraphs.length > 0 ? (
              <div className="story">
                <h2 className="sr-only">Histoire du projet</h2>
                {storyParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : null
          }
        />

        <nav className="project-nav" aria-label="Autres projets">
          {prev ? (
            <Link href={`/projets/${prev.slug}`} className="prev">
              <small>Projet précédent</small>
              {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/projets/${next.slug}`} className="next">
              <small>Projet suivant</small>
              {next.name}
            </Link>
          ) : null}
        </nav>
      </div>
    </article>
  );
}
