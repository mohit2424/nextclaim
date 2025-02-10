
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Mail, Phone, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Claim } from "@/pages/ClaimDetails";
import type { EmployerDetails } from "@/types/employer";

interface EmployerDetailsTabProps {
  claim: Claim;
  isEditing: boolean;
  onUpdate: (updatedClaim: Claim) => void;
}

export function EmployerDetailsTab({ claim, isEditing, onUpdate }: EmployerDetailsTabProps) {
  const queryClient = useQueryClient();

  const { data: employerDetails, isLoading } = useQuery({
    queryKey: ['employer_details', claim.employer_name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employer_details')
        .select('*')
        .eq('company_name', claim.employer_name)
        .single();

      if (error) throw error;
      return data as EmployerDetails;
    }
  });

  const updateEmployerMutation = useMutation({
    mutationFn: async (updatedDetails: Partial<EmployerDetails>) => {
      const { data, error } = await supabase
        .from('employer_details')
        .update(updatedDetails)
        .eq('company_name', claim.employer_name)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer_details', claim.employer_name] });
      toast.success('Employer details updated successfully');
    },
    onError: (error) => {
      console.error('Error updating employer details:', error);
      toast.error('Failed to update employer details');
    }
  });

  const handleInputChange = (field: keyof Claim | keyof EmployerDetails, value: any) => {
    if (field in claim) {
      onUpdate({
        ...claim,
        [field]: value
      });
    } else if (employerDetails) {
      updateEmployerMutation.mutate({
        ...employerDetails,
        [field]: value
      });
    }
  };

  const validateEmail = (email: string) => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\+?1?\d{10,15}$/.test(phone);
  };

  const handleEmailChange = (value: string) => {
    if (!validateEmail(value)) {
      toast.error('Please enter a valid email address');
      return;
    }
    handleInputChange('email_address', value);
  };

  const handlePhoneChange = (value: string) => {
    if (!validatePhone(value)) {
      toast.error('Please enter a valid phone number (10-15 digits)');
      return;
    }
    handleInputChange('phone_number', value);
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
        
        {employerDetails && (
          <>
            <div>
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                HR Representative
              </Label>
              <Input 
                value={employerDetails.hr_representative} 
                readOnly={!isEditing}
                onChange={(e) => handleInputChange('hr_representative', e.target.value)}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input 
                value={employerDetails.phone_number} 
                readOnly={!isEditing}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
            <div className="col-span-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input 
                value={employerDetails.email_address} 
                readOnly={!isEditing}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
