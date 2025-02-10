
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClaimantInformationTab } from "./ClaimantInformationTab";
import { EmployerDetailsTab } from "./EmployerDetailsTab";
import { UnemploymentDetailsTab } from "./UnemploymentDetailsTab";
import { DocumentsTab } from "./DocumentsTab";
import type { Claim } from "@/types/claim";

interface ClaimTabsProps {
  claim: Claim;
  claimId: string;
  isEditing: boolean;
  editedClaim: Claim | null;
  onUpdate: (updatedClaim: Claim) => void;
}

export function ClaimTabs({ claim, claimId, isEditing, editedClaim, onUpdate }: ClaimTabsProps) {
  return (
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
          onUpdate={onUpdate}
        />
      </TabsContent>

      <TabsContent value="employer">
        <EmployerDetailsTab 
          claim={editedClaim || claim}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      </TabsContent>

      <TabsContent value="unemployment">
        <UnemploymentDetailsTab 
          claim={editedClaim || claim}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentsTab claim={claim} claimId={claimId} />
      </TabsContent>
    </Tabs>
  );
}
