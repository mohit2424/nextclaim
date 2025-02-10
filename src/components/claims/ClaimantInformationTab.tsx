
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import type { Claim } from "@/pages/ClaimDetails";

interface ClaimantInformationTabProps {
  claim: Claim;
  isEditing: boolean;
  onUpdate: (updatedClaim: Claim) => void;
}

export function ClaimantInformationTab({ claim, isEditing, onUpdate }: ClaimantInformationTabProps) {
  const handleInputChange = (field: string, value: string | number) => {
    onUpdate({
      ...claim,
      [field]: value
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Claimant Information</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input 
            value={claim.first_name} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
        <div>
          <Label>Middle Name</Label>
          <Input 
            value={claim.middle_name || ''} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('middle_name', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input 
            value={claim.last_name} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
        <div>
          <Label>SSN</Label>
          <Input 
            value={claim.ssn} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('ssn', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
        <div>
          <Label>Age</Label>
          <Input 
            type="number"
            value={claim.age} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input 
            value={claim.phone} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
        <div className="col-span-2">
          <Label>Email</Label>
          <Input 
            value={claim.email} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
        <div>
          <Label>State</Label>
          <Input 
            value={claim.state} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
        <div>
          <Label>Pincode</Label>
          <Input 
            value={claim.pincode} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('pincode', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
      </div>
    </Card>
  );
}
