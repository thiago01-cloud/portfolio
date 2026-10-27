'use client';

import { useActionState } from 'react';
import { sendMessage } from '@/app/(site)/actions';

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, null);

  if (state?.ok) {
    return (
      <div className="contact-form sent" role="status">
        <h3>Message envoyé</h3>
        <p>Merci, je vous réponds dès que possible.</p>
      </div>
    );
  }

  const v = state?.values || {};

  return (
    <form className="contact-form" action={action} noValidate>
      <h3>Écrire un message</h3>
      <div className="hp" aria-hidden="true">
        <label>
          Site web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label>
        Nom
        <input name="name" required autoComplete="name" defaultValue={v.name} />
      </label>
      <div className="two">
        <label>
          E-mail
          <input name="email" type="email" autoComplete="email" defaultValue={v.email} />
        </label>
        <label>
          Téléphone
          <input name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} />
        </label>
      </div>
      <label>
        Sujet
        <input name="subject" defaultValue={v.subject} />
      </label>
      <label>
        Message
        <textarea name="body" rows={5} required defaultValue={v.body} />
      </label>
      {state?.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? 'Envoi…' : 'Envoyer le message'}
      </button>
    </form>
  );
}
