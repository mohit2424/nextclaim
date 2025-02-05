import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { PersonalInfoFields } from "@/components/claims/PersonalInfoFields";
import { ContactInfoFields } from "@/components/claims/ContactInfoFields";
import { AddressFields } from "@/components/claims/AddressFields";
import { ClaimDetailsFields } from "@/components/claims/ClaimDetailsFields";
import { ArrowLeft } from "lucide-react";

export const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  age: z.string().regex(/^\d+$/, "Age must be a number").transform(Number),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{5,6}$/, "Invalid pincode"),
  ssn: z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, "Invalid SSN format"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
  employerName: z.string().min(2, "Employer name is required"),
  claimDate: z.date({
    required_error: "Claim date is required",
  }),
  lastDayOfWork: z.date({
    required_error: "Last day of work is required",
  }),
  claimStatus: z.enum(["initial_review", "pending", "approved", "rejected"]),
  separationReason: z.enum([
    "resignation",
    "termination_misconduct",
    "layoff",
    "reduction_in_force",
    "constructive_discharge",
    "job_abandonment",
    "severance_agreement"
  ]),
});

export default function NewClaim() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      middleName: "",
      claimStatus: "initial_review",
    },
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      toast.error("Please login to submit a claim");
      navigate("/login");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast.error("Please login to submit a claim");
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from('claims')
        .insert([{
          age: values.age,
          claim_date: format(values.claimDate, 'yyyy-MM-dd'),
          claim_status: values.claimStatus,
          documents: [],
          email: values.email,
          employer_name: values.employerName,
          first_name: values.firstName,
          last_day_of_work: format(values.lastDayOfWork, 'yyyy-MM-dd'),
          last_name: values.lastName,
          middle_name: values.middleName,
          phone: values.phone,
          pincode: values.pincode,
          separation_reason: values.separationReason,
          severance_package: false,
          ssn: values.ssn,
          state: values.state,
          user_id: session.user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error submitting claim:', error);
        throw error;
      }

      toast.success("Claim submitted successfully");
      navigate("/claims");
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error("Failed to submit claim");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">New Unemployment Claim</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
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
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Claim</Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}
