import axios from 'axios';

export interface JournalFile {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface Journal {
  id: string;
  title: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  vaultId: string;
  files: JournalFile[];
}

class JournalService {
  // Get all journal entries for a vault
  async getJournals(vaultId: string): Promise<Journal[]> {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/vault/${vaultId}/journal`
    );
    return response.data;
  }

  // Get a specific journal entry
  async getJournal(vaultId: string, journalId: string): Promise<Journal> {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/vault/${vaultId}/journal/${journalId}`
    );
    return response.data;
  }

  // Create a new journal entry
  async createJournal(
    vaultId: string,
    data: {
      title?: string;
      content: string;
      attachments?: string[];
    }
  ): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/vault/${vaultId}/journal/create`,
      data
    );
    return response.data;
  }

  // Update a journal entry
  async updateJournal(
    vaultId: string,
    journalId: string,
    data: {
      title?: string;
      content?: string;
      attachments?: string[];
    }
  ): Promise<Journal> {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/vault/${vaultId}/journal/${journalId}`,
      data
    );
    return response.data;
  }

  // Delete a journal entry
  async deleteJournal(
    vaultId: string,
    journalId: string
  ): Promise<{ message: string }> {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/vault/${vaultId}/journal/${journalId}`
    );
    return response.data;
  }
}

export const journalService = new JournalService();
