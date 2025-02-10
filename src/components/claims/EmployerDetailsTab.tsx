
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import type { Claim } from "@/types/claim";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EmployerDetailsTabProps {
  claim: Claim;
  isEditing: boolean;
  onUpdate: (updatedClaim: Claim) => void;
}

export function EmployerDetailsTab({ claim, isEditing, onUpdate }: EmployerDetailsTabProps) {
  const { data: employerDetails } = useQuery({
    queryKey: ['employer_details', claim.employer_name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employer_details')
        .select('*')
        .eq('company_name', claim.employer_name)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleInputChange = (field: keyof Claim, value: string) => {
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
          <Label>Employer Name</Label>
          <Input 
            value={claim.employer_name} 
            readOnly={!isEditing}
            onChange={(e) => handleInputChange('employer_name', e.target.value)}
            className={!isEditing ? 'bg-gray-50' : ''}
          />
        </div>

        {employerDetails && (
          <>
            <div className="col-span-2">
              <Label>Employer Address</Label>
              <Input 
                value={employerDetails.employer_address || ''} 
                readOnly={!isEditing}
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label>HR Contact</Label>
              <Input 
                value={employerDetails.hr_representative || ''} 
                readOnly={!isEditing}
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                value={employerDetails.email_address || ''} 
                readOnly={!isEditing}
                className="bg-gray-50"
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
