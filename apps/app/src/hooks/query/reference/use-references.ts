import type { ReferenceFormValues } from '@/schemas/reference-schema';
import { referenceService } from '@/services/reference-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCheckUserVaults } from '../user/use-check-user-vaults';

export function useReferences() {
  const queryClient = useQueryClient();
  const { data } = useCheckUserVaults();
  const vaultId = data?.vaultId || '';

  // Fetch all references
  const {
    data: references,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['references', vaultId],
    queryFn: () => referenceService.getReferences(vaultId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!vaultId,
  });

  // Create a reference
  const createReferenceMutation = useMutation({
    mutationFn: (data: ReferenceFormValues) => {
      const referenceData = {
        ...data,
        vaultId: vaultId,
      };
      return referenceService.createReference(referenceData);
    },
    onSuccess: () => {
      toast.success('Reference added successfully');
      queryClient.invalidateQueries({ queryKey: ['references', vaultId] });
    },
    onError: (error) => {
      toast.error(
        `Failed to add reference: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    },
  });

  // Update an existing reference
  const updateReferenceMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: { id: string; data: Partial<ReferenceFormValues> }) => {
      return referenceService.updateReference(id, data);
    },
    onSuccess: () => {
      toast.success('Reference updated successfully');
      queryClient.invalidateQueries({ queryKey: ['references', vaultId] });
    },
    onError: (error) => {
      toast.error(
        `Failed to update reference: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    },
  });

  // Delete a reference
  const deleteReferenceMutation = useMutation({
    mutationFn: (id: string) => {
      return referenceService.deleteReference(id);
    },
    onSuccess: () => {
      toast.success('Reference deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['references', vaultId] });
    },
    onError: (error) => {
      toast.error(
        `Failed to delete reference: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    },
  });

  return {
    references,
    isLoading,
    isError,
    error,
    refetch,
    createReference: createReferenceMutation.mutate,
    isCreating: createReferenceMutation.isPending,
    updateReference: updateReferenceMutation.mutate,
    isUpdating: updateReferenceMutation.isPending,
    deleteReference: deleteReferenceMutation.mutate,
    isDeleting: deleteReferenceMutation.isPending,
  };
}
