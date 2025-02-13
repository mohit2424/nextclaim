
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClaimantInformationTab } from "./ClaimantInformationTab";
import { EmployerDetailsTab } from "./EmployerDetailsTab";
import { UnemploymentDetailsTab } from "./UnemploymentDetailsTab";
import { DocumentsTab } from "./DocumentsTab";
import type { Claim } from "@/pages/ClaimDetails";

interface ClaimTabsProps {
  claim: Claim;
  isEditing: boolean;
  onUpdate: (updatedClaim: Claim) => void;
}

export function ClaimTabs({ claim, isEditing, onUpdate }: ClaimTabsProps) {
  return (
    <Tabs defaultValue="claimant" className="space-y-4">
      <TabsList>
        <TabsTrigger value="claimant">Claimant Information</TabsTrigger>
        <TabsTrigger value="employer">Employer Details</TabsTrigger>
        <TabsTrigger value="unemployment">Unemployment Details</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>

      <TabsContent value="claimant">
        <ClaimantInformationTab
          claim={claim}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      </TabsContent>

      <TabsContent value="employer">
        <EmployerDetailsTab
          claim={claim}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      </TabsContent>

      <TabsContent value="unemployment">
        <UnemploymentDetailsTab
          claim={claim}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentsTab
          claim={claim}
          claimId={claim.id}
        />
      </TabsContent>
    </Tabs>
  );
}
