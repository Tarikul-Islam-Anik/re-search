import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UserStats {
  vaultCount: number;
  fileCount: number;
  referenceCount: number;
  journalCount: number;
}

export const useGetUserStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-stats', userId],
    queryFn: () => getUserStats(userId),
    enabled: !!userId,
  });
};

async function getUserStats(userId: string | undefined): Promise<UserStats> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/user/${userId}/stats`
  );

  return response.data;
}
