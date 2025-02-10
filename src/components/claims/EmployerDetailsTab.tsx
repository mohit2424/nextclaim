
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Claim } from "@/pages/ClaimDetails";

interface EmployerDetailsTabProps {
  claim: Claim;
  isEditing: boolean;
  onUpdate: (updatedClaim: Claim) => void;
}

export function EmployerDetailsTab({ claim, isEditing, onUpdate }: EmployerDetailsTabProps) {
  const handleInputChange = (field: string, value: any) => {
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
          {isEditing ? (
            <Select
              value={claim.separation_reason}
              onValueChange={(value: any) => handleInputChange('separation_reason', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resignation">Resignation</SelectItem>
                <SelectItem value="termination_misconduct">Termination for Misconduct</SelectItem>
                <SelectItem value="layoff">Layoff</SelectItem>
                <SelectItem value="reduction_in_force">Reduction in Force (RIF)</SelectItem>
                <SelectItem value="constructive_discharge">Constructive Discharge</SelectItem>
                <SelectItem value="job_abandonment">Job Abandonment</SelectItem>
                <SelectItem value="severance_agreement">Severance Agreement</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input 
              value={claim.separation_reason.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 
              readOnly
              className="bg-gray-50"
            />
          )}
        </div>
      </div>
    </Card>
  );
}
