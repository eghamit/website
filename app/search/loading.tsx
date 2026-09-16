export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 h-6 w-56 skeleton rounded" />
      <div className="mb-6 h-4 w-72 skeleton rounded" />
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 skeleton rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="aspect-[4/5] w-full skeleton" />
              <div className="space-y-2 p-3">
                <div className="h-3 w-1/3 skeleton rounded" />
                <div className="h-4 w-3/4 skeleton rounded" />
                <div className="h-5 w-1/2 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
