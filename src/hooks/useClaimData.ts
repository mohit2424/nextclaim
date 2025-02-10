
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Claim, ClaimStatus } from "@/types/claim";

export function useClaimData(id: string | undefined) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedClaim, setEditedClaim] = useState<Claim | null>(null);

  const { data: claim, isLoading, error } = useQuery({
    queryKey: ['claim', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('No claim ID provided');
      }

      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Claim not found');
      
      const transformedDocuments = Array.isArray(data.documents) 
        ? data.documents.map((doc: any) => ({
            name: doc.name || '',
            path: doc.path || '',
            type: doc.type || '',
            size: doc.size || 0
          }))
        : [];
      
      return {
        ...data,
        documents: transformedDocuments
      } as Claim;
    },
    enabled: !!id,
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedClaim(claim!);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedClaim(null);
  };

  const handleStatusChange = async (newStatus: ClaimStatus) => {
    if (!editedClaim) return;
    
    try {
      const { error } = await supabase
        .from('claims')
        .update({ claim_status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setEditedClaim({
        ...editedClaim,
        claim_status: newStatus
      });

      // Invalidate and refetch queries to update UI
      await queryClient.invalidateQueries({ queryKey: ['claims'] });
      await queryClient.invalidateQueries({ queryKey: ['claim', id] });
      await queryClient.invalidateQueries({ queryKey: ['claimStats'] });
      
      toast.success(`Claim status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating claim status:', error);
      toast.error('Failed to update claim status');
    }
  };

  const handleSaveEdit = async () => {
    if (!editedClaim) return;

    try {
      const { error } = await supabase
        .from('claims')
        .update({
          first_name: editedClaim.first_name,
          middle_name: editedClaim.middle_name,
          last_name: editedClaim.last_name,
          age: editedClaim.age,
          state: editedClaim.state,
          pincode: editedClaim.pincode,
          ssn: editedClaim.ssn,
          email: editedClaim.email,
          phone: editedClaim.phone,
          employer_name: editedClaim.employer_name,
          separation_reason: editedClaim.separation_reason,
          employment_start_date: editedClaim.employment_start_date,
          employment_end_date: editedClaim.employment_end_date,
          reason_for_unemployment: editedClaim.reason_for_unemployment,
          severance_package: editedClaim.severance_package,
          severance_amount: editedClaim.severance_amount,
          claim_status: editedClaim.claim_status,
        })
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['claim', id] });
      
      toast.success('Claim updated successfully');
      setIsEditing(false);
      setEditedClaim(null);
    } catch (error) {
      console.error('Error updating claim:', error);
      toast.error('Failed to update claim');
    }
  };

  return {
    claim,
    isLoading,
    error,
    isEditing,
    editedClaim,
    setEditedClaim,
    handleEditClick,
    handleCancelEdit,
    handleSaveEdit,
    handleStatusChange
  };
}
