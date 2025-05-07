import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useUserStore } from '../store/user';

interface PaperStatus {
  id: string;
  paperId: string;
  userId: string;
  status: 'read' | 'to-read' | 'favorite';
  createdAt: string;
  updatedAt: string;
}

interface UpdatePaperStatusParams {
  paperId: string;
  status: PaperStatus['status'];
}

export function usePaperStatus(paperId: string) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useUserStore();

  const { data: paperStatus, isLoading } = useQuery<PaperStatus | null>({
    queryKey: ['paper-status', paperId, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const response = await fetch(
        `/api/v1/user/${user.id}/paper-status?paperId=${paperId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch paper status');
      }
      return response.json();
    },
    enabled: !!user?.id,
  });

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async ({ status }: UpdatePaperStatusParams) => {
      if (!user?.id) throw new Error('User not authenticated');

      setIsUpdating(true);
      try {
        const response = await fetch(`/api/v1/user/${user.id}/paper-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paperId, status }),
        });

        if (!response.ok) {
          throw new Error('Failed to update paper status');
        }

        return response.json();
      } finally {
        setIsUpdating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['paper-status', paperId, user?.id],
      });
    },
  });

  const { mutateAsync: removeStatus } = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      setIsUpdating(true);
      try {
        const response = await fetch(
          `/api/v1/user/${user.id}/paper-status?paperId=${paperId}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to remove paper status');
        }

        return response.json();
      } finally {
        setIsUpdating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['paper-status', paperId, user?.id],
      });
    },
  });

  const toggleStatus = useCallback(
    async (status: PaperStatus['status']) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      if (paperStatus?.status === status) {
        await removeStatus();
      } else {
        await updateStatus({ paperId, status });
      }
    },
    [paperStatus?.status, paperId, removeStatus, updateStatus, user?.id]
  );

  return {
    paperStatus,
    isLoading,
    isUpdating,
    toggleStatus,
  };
}
