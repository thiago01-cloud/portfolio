'use client';

import { useActionState } from 'react';

// Formulaire branché sur une Server Action (prevState, formData) avec messages d'erreur / succès.
export default function FormShell({ action, children, submitLabel = 'Enregistrer', className = '', footer }) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className={`admin-form ${className}`}>
      {children}
      {state?.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="form-ok" role="status">
          {state.ok}
        </p>
      ) : null}
      <div className="form-actions">
        <button className="btn" type="submit" disabled={pending}>
          {pending ? 'Enregistrement…' : submitLabel}
        </button>
        {footer}
      </div>
    </form>
  );
}
