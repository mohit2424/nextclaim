
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import type { Claim } from "@/pages/ClaimDetails";

interface EmployerDetailsTabProps {
  claim: Claim;
  isEditing: boolean;
  onUpdate: (updatedClaim: Claim) => void;
}

export function EmployerDetailsTab({ claim, isEditing, onUpdate }: EmployerDetailsTabProps) {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({
      ...claim,
      [field]: value
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Employer Information</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Company Name</Label>
          <Input 
            value={claim.employer_name} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('employer_name', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
        <div>
          <Label>Separation Reason</Label>
          <Input 
            value={claim.separation_reason} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('separation_reason', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
      </div>
    </Card>
  );
}
