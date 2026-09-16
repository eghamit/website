import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <Compass size={48} className="text-muted" />
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-muted">The page you’re looking for doesn’t exist.</p>
      <Link href="/" className="btn-primary">
        Back home
      </Link>
    </div>
  );
}
