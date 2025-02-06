
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import type { Claim } from "@/pages/ClaimDetails";

interface EmployerDetailsTabProps {
  claim: Claim;
}

export function EmployerDetailsTab({ claim }: EmployerDetailsTabProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Employer Information</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Company Name</Label>
          <Input value={claim.employer_name} readOnly />
        </div>
        <div>
          <Label>Separation Reason</Label>
          <Input value={claim.separation_reason} readOnly />
        </div>
      </div>
    </Card>
  );
}
