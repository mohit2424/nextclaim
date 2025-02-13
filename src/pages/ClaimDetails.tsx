
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClaimHeader } from "@/components/claims/ClaimHeader";
import { ClaimTabs } from "@/components/claims/ClaimTabs";

export type ClaimStatus = "initial_review" | "in_progress" | "rejected";
export type SeparationReason = "resignation" | "termination_misconduct" | "layoff" | "reduction_in_force" | "constructive_discharge" | "job_abandonment" | "severance_agreement";

export interface Claim {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  age: number;
  state: string;
  pincode: string;
  ssn: string;
  email: string;
  phone: string;
  employer_name: string;
  claim_date: string;
  employment_start_date: string;
  employment_end_date: string;
  claim_status: ClaimStatus;
  documents: Array<{
    name: string;
    path: string;
    type: string;
    size: number;
  }>;
  separation_reason: SeparationReason;
  rejection_reason: string | null;
  severance_package: boolean;
  severance_amount: number | null;
  reason_for_unemployment: string | null;
  last_day_of_work: string | null;
  user_id: string;
}

export default function ClaimDetails() {
  const { id } = useParams<{ id: string }>();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClaim, setEditedClaim] = useState<Claim | null>(null);

  useEffect(() => {
    fetchClaim();
  }, [id]);

  const fetchClaim = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error("Error fetching claim details");
      return;
    }

    if (data) {
      const formattedClaim: Claim = {
        ...data,
        documents: data.documents || [],
        last_day_of_work: data.last_day_of_work || null,
        severance_amount: data.severance_amount || null,
        reason_for_unemployment: data.reason_for_unemployment || null
      };
      setClaim(formattedClaim);
      setEditedClaim(formattedClaim);
    }
  };

  const handleSave = async () => {
    if (!editedClaim || !id) return;

    const { error } = await supabase
      .from('claims')
      .update(editedClaim)
      .eq('id', id);

    if (error) {
      toast.error("Error updating claim");
      return;
    }

    setClaim(editedClaim);
    setIsEditing(false);
    toast.success("Claim updated successfully");
  };

  const handleCancel = () => {
    setEditedClaim(claim);
    setIsEditing(false);
  };

  if (!claim || !editedClaim) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <ClaimHeader
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
        />
        <ClaimTabs
          claim={editedClaim}
          isEditing={isEditing}
          onUpdate={setEditedClaim}
        />
      </div>
    </DashboardLayout>
  );
}
