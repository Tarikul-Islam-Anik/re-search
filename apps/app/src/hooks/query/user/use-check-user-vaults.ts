import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface CheckVaultsResponse {
  vaultId: string;
  hasVaults: boolean;
  vaultCount: number;
  vaultName: string;
  vaultDescription: string;
}

export const useCheckUserVaults = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['check-user-vaults', userId],
    queryFn: () => checkUserVaults(userId),
    enabled: !!userId,
  });
};

async function checkUserVaults(
  userId: string | undefined
): Promise<CheckVaultsResponse> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/user/${userId}/check-vaults`
  );

  return response.data;
}
