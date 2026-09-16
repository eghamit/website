import Link from 'next/link';
import { PackageX } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <PackageX size={48} className="text-muted" />
      <h1 className="text-2xl font-bold">Product not found</h1>
      <p className="text-muted">
        This product may no longer be available or the link is invalid.
      </p>
      <Link href="/search" className="btn-primary">
        Browse products
      </Link>
    </div>
  );
}
