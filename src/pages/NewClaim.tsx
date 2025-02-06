
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/integrations/supabase/types";

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

type FormValues = z.infer<typeof formSchema>;
type ClaimInsert = Database["public"]["Tables"]["claims"]["Insert"];

export default function NewClaim() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [searchSsn, setSearchSsn] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [existingClaim, setExistingClaim] = useState<null | { id: string }>(null);
  const [ssnError, setSsnError] = useState("");

  const form = useForm<FormValues>({
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

  const formatSSN = (ssn: string) => {
    // Remove any non-digit characters
    const cleaned = ssn.replace(/\D/g, '');
    
    // Format as XXX-XX-XXXX
    if (cleaned.length >= 9) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
    }
    return cleaned;
  };

  const checkExistingSSN = async (ssn: string) => {
    setIsSearching(true);
    setSsnError("");
    try {
      // Format SSN before checking
      const formattedSsn = formatSSN(ssn);
      if (formattedSsn.length !== 11) { // XXX-XX-XXXX = 11 characters
        setSsnError("Invalid SSN format. Must be XXX-XX-XXXX");
        return null;
      }

      const { data, error } = await supabase
        .from('claims')
        .select('id')
        .eq('ssn', formattedSsn)
        .maybeSingle();

      if (error) {
        console.error('Error checking SSN:', error);
        toast.error("Error checking SSN");
        return null;
      }

      setExistingClaim(data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error checking SSN");
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  const handleSsnSearch = async () => {
    if (!searchSsn) {
      setSsnError("Please enter an SSN");
      return;
    }

    const claim = await checkExistingSSN(searchSsn);
    
    if (claim) {
      toast.info("A claim with this SSN already exists");
    }
  };

  const handleViewExistingClaim = () => {
    if (existingClaim) {
      navigate(`/claims/${existingClaim.id}`);
    }
  };

  const handleSsnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value);
    setSearchSsn(formatted);
    setSsnError("");
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast.error("Please login to submit a claim");
        navigate("/login");
        return;
      }

      // Format SSN before submitting
      const formattedSsn = formatSSN(values.ssn);
      if (formattedSsn.length !== 11) {
        toast.error("Invalid SSN format. Must be XXX-XX-XXXX");
        return;
      }

      const insertData = {
        ...values,
        ssn: formattedSsn,
        claim_date: format(values.claimDate, 'yyyy-MM-dd'),
        last_day_of_work: format(values.lastDayOfWork, 'yyyy-MM-dd'),
        documents: [],
        user_id: session.user.id
      };

      const { data, error } = await supabase
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
    <DashboardLayout>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Search Existing Claims</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <div>
                <Input
                  placeholder="Enter SSN (XXX-XX-XXXX)"
                  value={searchSsn}
                  onChange={handleSsnChange}
                  maxLength={11}
                />
                {ssnError && (
                  <p className="text-sm text-red-500 mt-1">{ssnError}</p>
                )}
              </div>
              <div className="flex gap-4">
                <Button 
                  onClick={handleSsnSearch}
                  disabled={isSearching}
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
                {existingClaim ? (
                  <Button onClick={handleViewExistingClaim}>
                    View Existing Claim
                  </Button>
                ) : (
                  <Button onClick={() => setIsDialogOpen(false)}>
                    Add New Claim
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">New Unemployment Claim</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/claims')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Claims
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
                onClick={() => navigate('/claims')}
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
