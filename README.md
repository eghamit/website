# PriceCompare

A production-grade web app that lets you **search once and compare a product's
price, rating, discount and availability across multiple Indian e-commerce
stores** — Myntra, Ajio and Meesho — and instantly surfaces the best deal.

Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

![CI](https://img.shields.io/badge/CI-typecheck%20·%20lint%20·%20test%20·%20build-blue)

---

## Highlights

- 🔎 **Unified search** — one query fans out to every enabled store in parallel.
- 🧩 **Cross-store product matching** — a fuzzy matcher groups the *same* product
  from different stores so you compare like-for-like, not apples to oranges.
- 💰 **Best-deal engine** — computes the cheapest **in-stock** offer, the price
  range, and the exact rupees you save vs. the dearest store.
- 🎛️ **Rich filtering & sorting** — by store, brand, category, price range and
  rating; sort by price, rating or biggest discount. All state lives in the URL,
  so results are shareable and bookmarkable.
- 🧱 **Pluggable provider architecture** — add a store by dropping in one adapter
  file. Nothing else changes.
- ⚡ **Production concerns handled** — parallel fan-out with per-provider
  timeouts, graceful degradation when a store fails, TTL response caching,
  structured JSON logging, health checks, and a JSON API.
- 🌗 **Polished, responsive UI** — mobile-first, accessible, light/dark mode.
- ✅ **Tested** — the matching and aggregation engine is covered by unit tests.

## A note on the data

Myntra, Ajio and Meesho do **not** offer public product-comparison APIs, and
live scraping of them is against their terms of service and requires anti-bot
infrastructure. So this project ships with a **bundled reference dataset** that
models how the same product appears across stores (different titles, prices,
ratings and stock). This means the app **runs fully offline, out of the box**,
while the architecture is the real thing: each provider adapter is structured so
you can drop in genuine HTTP/API calls (or your own scraping/proxy service)
without touching the aggregator, matcher, API or UI. See
[Going live](#going-live-real-store-integration).

---

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

Optional configuration (all values have safe defaults):

```bash
cp .env.example .env.local
```

### Scripts

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start the dev server                          |
| `npm run build`     | Production build (Next.js standalone output)  |
| `npm run start`     | Serve the production build                    |
| `npm run typecheck` | `tsc --noEmit`                                |
| `npm run lint`      | ESLint (`next lint`)                          |
| `npm test`          | Run the Vitest unit suite                     |
| `npm run format`    | Prettier                                      |

---

## How it works

```
        ┌────────────────────────── request (/search or /api/search) ─────────────────────────┐
        │                                                                                        │
   parseSearchQuery ──▶ aggregator.search ──┬─▶ myntra adapter ─┐                                │
        (validation)         │              ├─▶ ajio adapter    ├─▶ raw Listing[] (per store)    │
                             │              └─▶ meesho adapter ─┘        │                        │
                             │   parallel fan-out + per-provider timeout │                        │
                             ▼                                           ▼                        │
                     matchListings ◀──────────────────────────  merge into cross-store Products   │
                     (fuzzy clustering)                                  │                        │
                             ▼                                           ▼                        │
                filter ▶ facet ▶ sort ▶ paginate ▶ cache ────────▶ SearchResult ─▶ UI / JSON ─────┘
```

### Cross-store matching (`lib/matcher.ts`, `lib/text.ts`)

Each store returns raw **listings**. The matcher clusters listings that refer to
the same product using a similarity score that:

- **requires the brand to match** (a strong disambiguator),
- scores **title token overlap** (Jaccard similarity over normalized,
  stop-word-filtered tokens),
- rewards **colour agreement** and penalises colour mismatch,
- and **never** puts two listings from the same store in one cluster.

Clusters at or above `MATCH_THRESHOLD` become a single `Product` with all its
`Offer`s, plus precomputed derived fields (best in-stock offer, price range,
max savings, weighted average rating). The clustering is greedy and
order-independent, and each product gets a **stable id** so links are durable.

### Resilience & performance

- **Parallel fan-out** with a hard per-provider timeout (`PROVIDER_TIMEOUT_MS`) —
  one slow store can't stall the page.
- **Graceful degradation** — if a provider errors, results from the rest are
  still returned and the failing store is reported in `providerErrors`.
- **TTL cache** (`lib/cache.ts`) keyed by a normalized query — repeat searches
  are served instantly. Swap the in-process cache for Redis behind the same
  interface to scale horizontally.

---

## JSON API

| Endpoint                | Description                                                    |
| ----------------------- | ------------------------------------------------------------- |
| `GET /api/search`       | Matched cross-store products with facets & pagination         |
| `GET /api/products/:id` | A single matched product with all its store offers            |
| `GET /api/compare`      | Only multi-store products, with a compact best/worst summary  |
| `GET /api/providers`    | Which stores are enabled and in what mode                     |
| `GET /api/health`       | Liveness/readiness probe                                      |

**Search query parameters:** `q`, `providers` (csv), `brand`, `category`,
`minPrice`, `maxPrice`, `minRating`, `sort`
(`relevance|price_asc|price_desc|rating_desc|discount_desc`), `page`, `pageSize`.

```bash
curl 'http://localhost:3000/api/search?q=running%20shoes&sort=price_asc'
curl 'http://localhost:3000/api/compare?q=smartwatch'
```

---

## Going live: real store integration

1. Set `PROVIDER_MODE=live` in your environment.
2. Implement `search()` and `getListing()` in `lib/providers/myntra.ts` (and the
   others) to call the real upstream, mapping each response to the shared
   `Listing` shape in `lib/types.ts`. Credentials/base URLs are read from env
   (see `.env.example`).
3. Everything downstream — matching, filtering, caching, the API and the UI —
   works unchanged, because it only ever sees the normalized `Listing`/`Product`
   types.

### Adding a new store

1. Create `lib/providers/<store>.ts` exporting a `ProviderAdapter`.
2. Register it in `lib/providers/index.ts` and add its id to the `ProviderId`
   union in `lib/types.ts`.
3. Add a badge colour in `components/ProviderBadge.tsx`. Done.

---

## Deployment

**Docker**

```bash
docker build -t price-compare .
docker run -p 3000:3000 price-compare
```

The image uses Next.js `standalone` output and a non-root user, with a built-in
`HEALTHCHECK` against `/api/health`.

**Vercel / Node host** — `npm run build` then `npm run start`, or deploy the repo
directly to any platform that supports Next.js.

---

## Project structure

```
app/                     # App Router pages & API routes
  page.tsx               #   landing + search
  search/page.tsx        #   results (filters, sort, grid, pagination)
  product/[id]/page.tsx  #   product detail + comparison table
  api/                   #   search, products, compare, providers, health
components/              # UI components (cards, filters, table, theme…)
lib/
  types.ts               # shared domain types
  config.ts              # env-driven configuration
  providers/             # provider adapters (base + myntra/ajio/meesho)
  data/catalog.ts        # bundled reference catalog
  text.ts                # normalization + similarity
  matcher.ts             # cross-store clustering
  aggregator.ts          # the search pipeline (fan-out → match → facet → page)
  cache.ts, logger.ts    # infra
  *.test.ts              # unit tests (Vitest)
```

## Tech stack

Next.js 14 · React 18 · TypeScript (strict) · Tailwind CSS · lucide-react ·
Vitest · ESLint · Prettier · Docker · GitHub Actions.

## Disclaimer

This is a demonstration project. The bundled prices, ratings and availability are
illustrative and **not** affiliated with, endorsed by, or sourced from Myntra,
Ajio or Meesho. Respect each store's Terms of Service and `robots.txt` before
integrating live data.
