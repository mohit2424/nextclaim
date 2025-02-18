
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { PersonalInfoFields } from "@/components/claims/PersonalInfoFields";
import { ContactInfoFields } from "@/components/claims/ContactInfoFields";
import { AddressFields } from "@/components/claims/AddressFields";
import { ClaimDetailsFields } from "@/components/claims/ClaimDetailsFields";
import { formSchema } from "@/pages/NewClaim";
import type { FormValues } from "@/pages/NewClaim";
import type { Database } from "@/integrations/supabase/types";

interface ClaimFormProps {
  onCancel: () => void;
}

export function ClaimForm({ onCancel }: ClaimFormProps) {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      middleName: "",
      claimStatus: "initial_review", // Set default but don't show in form
    },
  });

  const formatSSN = (ssn: string) => {
    const cleaned = ssn.replace(/\D/g, '');
    if (cleaned.length >= 9) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
    }
    return cleaned;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast.error("Please login to submit a claim");
        navigate("/login");
        return;
      }

      const formattedSsn = formatSSN(values.ssn);
      if (formattedSsn.length !== 11) {
        toast.error("Invalid SSN format. Must be XXX-XX-XXXX");
        return;
      }

      const insertData: Database["public"]["Tables"]["claims"]["Insert"] = {
        id: crypto.randomUUID(),
        age: values.age,
        claim_date: format(values.claimDate, 'yyyy-MM-dd'),
        claim_status: "initial_review", // Always set to initial_review
        documents: [],
        email: values.email,
        employer_name: values.employerName,
        first_name: values.firstName,
        employment_start_date: format(values.employmentStartDate, 'yyyy-MM-dd'),
        employment_end_date: format(values.employmentEndDate, 'yyyy-MM-dd'),
        last_name: values.lastName,
        middle_name: values.middleName || null,
        phone: values.phone,
        pincode: values.pincode,
        separation_reason: values.separationReason,
        severance_package: false,
        ssn: formattedSsn,
        state: values.state,
        user_id: session.user.id
      };

      const { error } = await supabase
        .from('claims')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error("A claim with this SSN already exists");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Claim submitted successfully");
      navigate("/claims");
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error("Failed to submit claim");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PersonalInfoFields form={form} />
          <ContactInfoFields form={form} />
          <AddressFields form={form} />
          <ClaimDetailsFields form={form} />
        </div>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">Submit Claim</Button>
        </div>
      </form>
    </Form>
  );
}
