
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowLeft } from "lucide-react";
import { SSNSearchDialog } from "@/components/claims/SSNSearchDialog";
import { ClaimForm } from "@/components/claims/ClaimForm";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";

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
  employmentStartDate: z.date({
    required_error: "Employment start date is required",
  }),
  employmentEndDate: z.date({
    required_error: "Employment end date is required",
  }),
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

export type FormValues = z.infer<typeof formSchema>;

export default function NewClaim() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(true);

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

  return (
    <DashboardLayout>
      <SSNSearchDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />

      <div className="container mx-auto py-6 overflow-y-auto overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">New Unemployment Claim</h1>
        </div>
        
        <ClaimForm onCancel={() => navigate('/claims')} />
      </div>
    </DashboardLayout>
  );
}
