import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <Compass size={48} className="text-muted" />
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-muted">That page doesn’t exist. Let’s get you back to learning.</p>
      <div className="flex gap-3">
        <Link href="/" className="btn-ghost">
          Home
        </Link>
        <Link href="/learn" className="btn-primary">
          Curriculum
        </Link>
      </div>
    </div>
  );
}
