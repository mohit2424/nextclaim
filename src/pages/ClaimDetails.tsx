
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ClaimantInformationTab } from "@/components/claims/ClaimantInformationTab";
import { EmployerDetailsTab } from "@/components/claims/EmployerDetailsTab";
import { UnemploymentDetailsTab } from "@/components/claims/UnemploymentDetailsTab";
import { DocumentsTab } from "@/components/claims/DocumentsTab";
import { toast } from "sonner";
import { useState } from "react";

export type ClaimDocument = {
  name: string;
  path: string;
  type: string;
  size: number;
};

export type Claim = {
  id: string;
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
  claim_status: string;
  separation_reason: "resignation" | "termination_misconduct" | "layoff" | "reduction_in_force" | "constructive_discharge" | "job_abandonment" | "severance_agreement";
  documents: ClaimDocument[];
  employment_start_date: string | null;
  employment_end_date: string | null;
  severance_package: boolean | null;
  created_at?: string;
  updated_at?: string;
  user_id?: string | null;
  rejection_reason?: string | null;
};

export default function ClaimDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      
      const transformedData: Claim = {
        ...data,
        documents: transformedDocuments
      };
      
      return transformedData;
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
          severance_package: editedClaim.severance_package,
        })
        .eq('id', id);

      if (error) throw error;

      // Force a refetch of the claim data
      await queryClient.invalidateQueries({ queryKey: ['claim', id] });
      
      toast.success('Claim updated successfully');
      setIsEditing(false);
      setEditedClaim(null);
    } catch (error) {
      console.error('Error updating claim:', error);
      toast.error('Failed to update claim');
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Claim</h2>
          <p className="text-muted-foreground mt-2">{error.message}</p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/dashboard')}
          >
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[500px]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!claim) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Claim not found</h2>
          <p className="text-muted-foreground">The requested claim could not be found.</p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/dashboard')}
          >
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Claim Details</h1>
            <p className="text-muted-foreground">Claim ID: {id}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Print Claim</Button>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </>
            ) : (
              <Button onClick={handleEditClick}>Edit Claim</Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="claimant">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="claimant">Claimant Information</TabsTrigger>
            <TabsTrigger value="employer">Employer Details</TabsTrigger>
            <TabsTrigger value="unemployment">Unemployment Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="claimant">
            <ClaimantInformationTab 
              claim={editedClaim || claim} 
              isEditing={isEditing}
              onUpdate={setEditedClaim}
            />
          </TabsContent>

          <TabsContent value="employer">
            <EmployerDetailsTab 
              claim={editedClaim || claim}
              isEditing={isEditing}
              onUpdate={setEditedClaim}
            />
          </TabsContent>

          <TabsContent value="unemployment">
            <UnemploymentDetailsTab 
              claim={editedClaim || claim}
              isEditing={isEditing}
              onUpdate={setEditedClaim}
            />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab claim={claim} claimId={id!} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
