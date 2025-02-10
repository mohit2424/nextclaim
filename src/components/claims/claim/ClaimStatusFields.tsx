
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "@/pages/NewClaim";
import { ClaimStatus } from "@/types/claim";

interface ClaimStatusFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  isEditing?: boolean;
  currentStatus?: ClaimStatus;
  onStatusChange?: (status: ClaimStatus) => void;
}

export function ClaimStatusFields({ form, isEditing = false, currentStatus, onStatusChange }: ClaimStatusFieldsProps) {
  // Separate form field for separation reason
  const separationReasonField = (
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
  );

  // Status field only shown when editing
  const statusField = isEditing && (
    <FormItem>
      <FormLabel>Claim Status</FormLabel>
      <Select 
        value={currentStatus} 
        onValueChange={(value: ClaimStatus) => onStatusChange?.(value)}
        disabled={!isEditing}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="initial_review">Initial Review</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );

  return (
    <div className="space-y-4">
      {statusField}
      {separationReasonField}
    </div>
  );
}
