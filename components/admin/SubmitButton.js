'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton({ children, className = 'btn-link', pendingText }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
