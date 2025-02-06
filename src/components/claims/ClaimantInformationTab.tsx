
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import type { Claim } from "@/pages/ClaimDetails";

interface ClaimantInformationTabProps {
  claim: Claim;
}

export function ClaimantInformationTab({ claim }: ClaimantInformationTabProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Claimant Information</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Full Name</Label>
          <Input value={`${claim.first_name} ${claim.middle_name || ''} ${claim.last_name}`} readOnly />
        </div>
        <div>
          <Label>SSN</Label>
          <Input value={claim.ssn} readOnly />
        </div>
        <div>
          <Label>Age</Label>
          <Input value={claim.age} readOnly />
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={claim.phone} readOnly />
        </div>
        <div className="col-span-2">
          <Label>Email</Label>
          <Input value={claim.email} readOnly />
        </div>
        <div className="col-span-2">
          <Label>Address</Label>
          <Input value={`${claim.state}, ${claim.pincode}`} readOnly />
        </div>
      </div>
    </Card>
  );
}
