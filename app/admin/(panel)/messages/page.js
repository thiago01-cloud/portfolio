import { prisma } from '@/lib/prisma';
import { formatDateTime, telHref } from '@/lib/format';
import ViewToggle, { readView } from '@/components/admin/ViewToggle';
import ConfirmButton from '@/components/admin/ConfirmButton';
import SubmitButton from '@/components/admin/SubmitButton';
import { deleteMessage, toggleMessageRead } from '../../actions';

export default async function MessagesPage({ searchParams }) {
  const view = readView(await searchParams);
  const messages = await prisma.message.findMany({ orderBy: [{ read: 'asc' }, { createdAt: 'desc' }] });
  const unread = messages.filter((m) => !m.read).length;

  const actions = (m) => (
    <div className="item-actions">
      {m.email ? (
        <a className="btn-link" href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || 'Votre message'}`)}`}>
          Répondre
        </a>
      ) : null}
      <form action={toggleMessageRead.bind(null, m.id)}>
        <SubmitButton>{m.read ? 'Marquer non lu' : 'Marquer lu'}</SubmitButton>
      </form>
      <form action={deleteMessage.bind(null, m.id)}>
        <ConfirmButton message={`Supprimer le message de ${m.name} ?`}>Supprimer</ConfirmButton>
      </form>
    </div>
  );

  const contact = (m) => (
    <>
      {m.email ? <a href={`mailto:${m.email}`}>{m.email}</a> : null}
      {m.email && m.phone ? ', ' : null}
      {m.phone ? <a href={telHref(m.phone)}>{m.phone}</a> : null}
    </>
  );

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Messages</h1>
          <p>
            {messages.length} message{messages.length > 1 ? 's' : ''}, dont {unread} non lu{unread > 1 ? 's' : ''}
          </p>
        </div>
        <div className="head-tools">
          <ViewToggle basePath="/admin/messages" view={view} />
        </div>
      </header>

      {messages.length === 0 ? (
        <div className="empty-state">
          <p>Aucun message. Les messages envoyés depuis le formulaire de contact du site arriveront ici.</p>
        </div>
      ) : view === 'tableau' ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">De</th>
                <th scope="col">Contact</th>
                <th scope="col">Message</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} className={m.read ? '' : 'unread'}>
                  <td className="nowrap">{formatDateTime(m.createdAt)}</td>
                  <td>{m.name}</td>
                  <td>{contact(m)}</td>
                  <td>
                    {m.subject ? <strong>{m.subject}. </strong> : null}
                    {m.body}
                  </td>
                  <td>{actions(m)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cards">
          {messages.map((m) => (
            <article key={m.id} className={`card message${m.read ? '' : ' unread'}`}>
              <div className="card-body">
                <div className="msg-top">
                  <h2>{m.name}</h2>
                  {!m.read ? <span className="badge badge-new">Nouveau</span> : null}
                </div>
                <p className="muted small">
                  {formatDateTime(m.createdAt)}
                </p>
                <p className="small">{contact(m)}</p>
                {m.subject ? <p className="msg-subject">{m.subject}</p> : null}
                <p className="msg-body">{m.body}</p>
              </div>
              {actions(m)}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
