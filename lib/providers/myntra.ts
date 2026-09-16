import type { Listing, SearchQuery } from '../types';
import { config } from '../config';
import { DatasetProviderAdapter, type ProviderAdapter } from './base';

/**
 * Myntra adapter.
 *
 * In `dataset` mode it serves the bundled catalog. In `live` mode, wire the two
 * methods below to Myntra's real endpoints (or your own scraping/proxy service)
 * and return the same {@link Listing} shape — the rest of the app is unchanged.
 */
class MyntraAdapter implements ProviderAdapter {
  readonly id = 'myntra' as const;
  readonly name = 'Myntra';
  private dataset = new DatasetProviderAdapter(this.id, this.name);

  async search(query: SearchQuery): Promise<Listing[]> {
    if (config.providerMode === 'dataset') return this.dataset.search(query);
    // --- live integration goes here ---
    // const res = await fetchWithTimeout(`${process.env.MYNTRA_API_BASE}/search?q=${...}`);
    // return res.products.map(mapMyntraToListing);
    throw new Error('Myntra live mode is not configured. Set PROVIDER_MODE=dataset or implement the live client.');
  }

  async getListing(id: string): Promise<Listing | null> {
    if (config.providerMode === 'dataset') return this.dataset.getListing(id);
    throw new Error('Myntra live mode is not configured.');
  }
}

export const myntra = new MyntraAdapter();
