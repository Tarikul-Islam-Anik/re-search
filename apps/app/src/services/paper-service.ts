import type { PaperData } from '@/store/use-paper-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface SavePaperResponse {
  id: string;
  success: boolean;
}

interface Vault {
  id: string;
  name: string;
  description: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to handle API errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 'API request failed';
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function savePaper(paper: PaperData): Promise<SavePaperResponse> {
  // Get the default vault ID (in a real app, you might want to make this configurable)
  const vaultsResponse = await fetch(`${API_URL}/v1/vault`, {
    credentials: 'include',
  });

  const vaults = await handleResponse<Vault[]>(vaultsResponse);

  if (!vaults || vaults.length === 0) {
    throw new Error('No vaults found. Please create a vault first.');
  }

  const defaultVaultId = vaults[0].id;

  // If paper already has an ID, update it
  if (paper.id) {
    return updatePaper(defaultVaultId, paper.id, paper);
  }

  // Otherwise create a new paper
  const response = await fetch(
    `${API_URL}/v1/vault/${defaultVaultId}/paper/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: paper.title,
        abstract: paper.abstract,
        content: paper.content,
        keywords: paper.keywords,
        publicationDate: paper.publicationDate,
        doi: paper.doi,
        journal: paper.journal,
        volume: paper.volume,
        issue: paper.issue,
        pages: paper.pages,
      }),
      credentials: 'include',
    }
  );

  return handleResponse<SavePaperResponse>(response);
}

export async function getPaper(id: string): Promise<PaperData> {
  // Get the default vault ID
  const vaultsResponse = await fetch(`${API_URL}/v1/vault`, {
    credentials: 'include',
  });

  const vaults = await handleResponse<Vault[]>(vaultsResponse);

  if (!vaults || vaults.length === 0) {
    throw new Error('No vaults found. Please create a vault first.');
  }

  const defaultVaultId = vaults[0].id;

  const response = await fetch(
    `${API_URL}/v1/vault/${defaultVaultId}/paper?paperId=${id}`,
    {
      credentials: 'include',
    }
  );

  return handleResponse<PaperData>(response);
}

export async function updatePaper(
  vaultId: string,
  paperId: string,
  paper: Partial<PaperData>
): Promise<SavePaperResponse> {
  const response = await fetch(
    `${API_URL}/v1/vault/${vaultId}/paper?paperId=${paperId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: paper.title,
        abstract: paper.abstract,
        content: paper.content,
        keywords: paper.keywords,
        publicationDate: paper.publicationDate,
        doi: paper.doi,
        journal: paper.journal,
        volume: paper.volume,
        issue: paper.issue,
        pages: paper.pages,
      }),
      credentials: 'include',
    }
  );

  return handleResponse<SavePaperResponse>(response);
}

export async function listPapers(): Promise<PaperData[]> {
  // Get the default vault ID
  const vaultsResponse = await fetch(`${API_URL}/v1/vault`, {
    credentials: 'include',
  });

  const vaults = await handleResponse<Vault[]>(vaultsResponse);

  if (!vaults || vaults.length === 0) {
    throw new Error('No vaults found. Please create a vault first.');
  }

  const defaultVaultId = vaults[0].id;

  const response = await fetch(`${API_URL}/v1/vault/${defaultVaultId}/paper`, {
    credentials: 'include',
  });

  return handleResponse<PaperData[]>(response);
}

export async function deletePaper(
  paperId: string
): Promise<{ success: boolean }> {
  // Get the default vault ID
  const vaultsResponse = await fetch(`${API_URL}/v1/vault`, {
    credentials: 'include',
  });

  const vaults = await handleResponse<Vault[]>(vaultsResponse);

  if (!vaults || vaults.length === 0) {
    throw new Error('No vaults found. Please create a vault first.');
  }

  const defaultVaultId = vaults[0].id;

  const response = await fetch(
    `${API_URL}/v1/vault/${defaultVaultId}/paper?paperId=${paperId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  return handleResponse<{ success: boolean }>(response);
}
