
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClaimHeader } from "@/components/claims/ClaimHeader";
import { ClaimTabs } from "@/components/claims/ClaimTabs";
import { useClaimData } from "@/hooks/useClaimData";

export type { Claim, ClaimDocument } from "@/types/claim";

export default function ClaimDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    claim,
    isLoading,
    error,
    isEditing,
    editedClaim,
    setEditedClaim,
    handleEditClick,
    handleCancelEdit,
    handleSaveEdit
  } = useClaimData(id);

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
        <ClaimHeader
          id={id!}
          isEditing={isEditing}
          onEditClick={handleEditClick}
          onCancelEdit={handleCancelEdit}
          onSaveEdit={handleSaveEdit}
        />

        <ClaimTabs
          claim={claim}
          claimId={id!}
          isEditing={isEditing}
          editedClaim={editedClaim}
          onUpdate={setEditedClaim}
        />
      </div>
    </DashboardLayout>
  );
}
