import type { File } from '@repo/database';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCheckUserVaults } from '../user/use-check-user-vaults';

export const useGetFiles = () => {
  const { data } = useCheckUserVaults();
  const vaultId = data?.vaultId;

  return useQuery({
    queryKey: ['files', vaultId],
    queryFn: () => fetchFiles(vaultId),
    enabled: !!vaultId,
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  const { data } = useCheckUserVaults();
  const vaultId = data?.vaultId;

  return useMutation({
    mutationFn: async (fileId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/vault/${vaultId}/file`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: fileId }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', vaultId] });
    },
  });
};

async function fetchFiles(vaultId: string | undefined): Promise<File[]> {
  if (!vaultId) {
    throw new Error('Vault ID is required');
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/vault/${vaultId}/file`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch files');
  }
  return response.json();
}
