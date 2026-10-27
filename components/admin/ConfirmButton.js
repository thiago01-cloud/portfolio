'use client';

import { useFormStatus } from 'react-dom';

// Bouton d'envoi qui demande confirmation avant une action irréversible.
export default function ConfirmButton({ message, children, className = 'btn-link danger', confirmText }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(e) => {
        if (message && !window.confirm(message)) e.preventDefault();
      }}
    >
      {pending && confirmText ? confirmText : children}
    </button>
  );
}
