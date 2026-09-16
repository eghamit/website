import type { Listing, SearchQuery } from '../types';
import { config } from '../config';
import { DatasetProviderAdapter, type ProviderAdapter } from './base';

/**
 * Ajio adapter. See {@link ./myntra.ts} for the live-integration pattern.
 */
class AjioAdapter implements ProviderAdapter {
  readonly id = 'ajio' as const;
  readonly name = 'Ajio';
  private dataset = new DatasetProviderAdapter(this.id, this.name);

  async search(query: SearchQuery): Promise<Listing[]> {
    if (config.providerMode === 'dataset') return this.dataset.search(query);
    throw new Error('Ajio live mode is not configured. Set PROVIDER_MODE=dataset or implement the live client.');
  }

  async getListing(id: string): Promise<Listing | null> {
    if (config.providerMode === 'dataset') return this.dataset.getListing(id);
    throw new Error('Ajio live mode is not configured.');
  }
}

export const ajio = new AjioAdapter();
