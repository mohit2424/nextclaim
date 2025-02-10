
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BriefcaseIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { Claim } from "@/types/claim";

interface UnemploymentDetailsTabProps {
  claim: Claim;
  isEditing: boolean;
  onUpdate: (updatedClaim: Claim) => void;
}

export function UnemploymentDetailsTab({ claim, isEditing, onUpdate }: UnemploymentDetailsTabProps) {
  const handleInputChange = (field: keyof Claim, value: any) => {
    onUpdate({
      ...claim,
      [field]: value
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <BriefcaseIcon className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Unemployment Details</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Day of Work</Label>
          <Input 
            type="date"
            value={claim.employment_start_date} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('employment_start_date', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
        <div>
          <Label>Last Day of Work</Label>
          <Input 
            type="date"
            value={claim.employment_end_date} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('employment_end_date', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
        <div className="col-span-2">
          <Label>Reason for Unemployment</Label>
          <Input 
            value={claim.reason_for_unemployment || ''} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('reason_for_unemployment', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label>Severance Package</Label>
          <Switch
            checked={claim.severance_package || false}
            disabled={!isEditing}
            onCheckedChange={(checked) => handleInputChange('severance_package', checked)}
          />
        </div>
        {claim.severance_package && (
          <div>
            <Label>Severance Amount</Label>
            <Input 
              type="number"
              value={claim.severance_amount || ''} 
              readOnly={!isEditing}
              onChange={(e) => handleInputChange('severance_amount', parseFloat(e.target.value))}
              className={!isEditing ? 'bg-gray-50' : ''}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
