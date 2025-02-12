
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "@/pages/NewClaim";

interface ClaimStatusFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function ClaimStatusFields({ form }: ClaimStatusFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="claimStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Claim Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="initial_review">Initial Review</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="separationReason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Separation Reason</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
              </FormControl>
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
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
