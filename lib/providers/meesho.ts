import type { Listing, SearchQuery } from '../types';
import { config } from '../config';
import { DatasetProviderAdapter, type ProviderAdapter } from './base';

/**
 * Meesho adapter. See {@link ./myntra.ts} for the live-integration pattern.
 */
class MeeshoAdapter implements ProviderAdapter {
  readonly id = 'meesho' as const;
  readonly name = 'Meesho';
  private dataset = new DatasetProviderAdapter(this.id, this.name);

  async search(query: SearchQuery): Promise<Listing[]> {
    if (config.providerMode === 'dataset') return this.dataset.search(query);
    throw new Error('Meesho live mode is not configured. Set PROVIDER_MODE=dataset or implement the live client.');
  }

  async getListing(id: string): Promise<Listing | null> {
    if (config.providerMode === 'dataset') return this.dataset.getListing(id);
    throw new Error('Meesho live mode is not configured.');
  }
}

export const meesho = new MeeshoAdapter();
