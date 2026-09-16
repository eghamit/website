export function Footer() {
  return (
    <footer className="border-t border-app">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-semibold text-[rgb(var(--text))]">PriceCompare</span> — compare
            products across Myntra, Ajio &amp; Meesho.
          </p>
          <p className="text-xs">
            Demo dataset. Prices are illustrative and not affiliated with any store.
          </p>
        </div>
      </div>
    </footer>
  );
}
