import type { ReferenceFormValues } from '@/schemas/reference-schema';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Types
interface Reference {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  vaultId: string;
  createdAt: string;
  updatedAt: string;
}

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Reference service functions
export const referenceService = {
  // Get all references (optionally filtered by vaultId)
  async getReferences(vaultId?: string): Promise<Reference[]> {
    const params = vaultId ? { vaultId } : {};
    const response = await api.get('/v1/references', { params });
    return response.data;
  },

  // Get a single reference by ID
  async getReference(id: string): Promise<Reference> {
    const response = await api.get(`/v1/references/${id}`);
    return response.data;
  },

  // Create a new reference
  async createReference(data: ReferenceFormValues): Promise<Reference> {
    if (!data.vaultId) {
      throw new Error('Vault ID is required');
    }
    const response = await api.post('/v1/references', data);
    return response.data;
  },

  // Update an existing reference
  async updateReference(
    id: string,
    data: Partial<ReferenceFormValues>
  ): Promise<Reference> {
    const response = await api.patch(`/v1/references/${id}`, data);
    return response.data;
  },

  // Delete a reference
  async deleteReference(id: string): Promise<void> {
    await api.delete(`/v1/references/${id}`);
  },

  // Fetch reference data from a DOI
  async fetchReferenceByDoi(doi: string): Promise<Partial<Reference>> {
    // Properly encode the DOI to handle URLs with slashes
    const encodedDoi = encodeURIComponent(doi);
    const response = await api.get(`/v1/references/doi/${encodedDoi}`);
    return response.data;
  },
};
