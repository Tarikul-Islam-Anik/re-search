'use server';

import type { ReferenceFormValues } from '@/schemas/reference-schema';
import { referenceService } from '@/services/reference-service';

export async function fetchReferenceByDoi(doi: string) {
  try {
    return await referenceService.fetchReferenceByDoi(doi);
  } catch (error) {
    console.error('Error fetching reference by DOI:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch reference data'
    );
  }
}

export async function createReference(data: ReferenceFormValues) {
  try {
    return await referenceService.createReference(data);
  } catch (error) {
    console.error('Error creating reference:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create reference'
    );
  }
}
