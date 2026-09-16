'use client';

import { useEffect } from 'react';
import { AlertOctagon } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <AlertOctagon size={48} className="text-rose-500" />
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted">
        An unexpected error occurred while loading this page. Please try again.
      </p>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
