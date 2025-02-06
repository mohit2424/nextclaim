
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BriefcaseIcon } from "lucide-react";
import type { Claim } from "@/pages/ClaimDetails";

interface UnemploymentDetailsTabProps {
  claim: Claim;
}

export function UnemploymentDetailsTab({ claim }: UnemploymentDetailsTabProps) {
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
            value={claim.employment_start_date ? new Date(claim.employment_start_date).toLocaleDateString() : 'Not specified'} 
            readOnly 
          />
        </div>
        <div>
          <Label>Last Day of Work</Label>
          <Input 
            value={claim.employment_end_date ? new Date(claim.employment_end_date).toLocaleDateString() : 'Not specified'} 
            readOnly 
          />
        </div>
        <div>
          <Label>Reason for Unemployment</Label>
          <Input value={claim.reason_for_unemployment || 'Not specified'} readOnly />
        </div>
        <div>
          <Label>Severance Package</Label>
          <Input value={claim.severance_package ? 'Yes' : 'No'} readOnly />
        </div>
        {claim.severance_package && (
          <div>
            <Label>Severance Amount</Label>
            <Input value={`$${claim.severance_amount?.toFixed(2) || '0.00'}`} readOnly />
          </div>
        )}
      </div>
    </Card>
  );
}
