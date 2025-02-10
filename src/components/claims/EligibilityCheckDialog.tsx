
import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type { ClaimStatus } from "@/types/claim";

interface EligibilityCheckDialogProps {
  claimId: string;
  employmentStartDate: string | null;
  employmentEndDate: string | null;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export function EligibilityCheckDialog({ 
  claimId,
  employmentStartDate,
  employmentEndDate,
  onClose,
  onStatusUpdate
}: EligibilityCheckDialogProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkEligibility = async () => {
    try {
      console.log('Checking eligibility with dates:', { employmentStartDate, employmentEndDate });
      
      const { data, error } = await supabase.rpc('check_claim_eligibility', {
        start_date: employmentStartDate,
        end_date: employmentEndDate
      });

      if (error) throw error;

      console.log('Eligibility check result:', data);
      setIsEligible(data);
      
      if (!data) {
        setRejectionReason("Employee did not meet the minimum 4-month employment duration requirement.");
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
      toast({
        title: "Error",
        description: "Failed to check eligibility. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkEligibility();
  }, []);

  const sendRejectionEmail = async (firstName: string, lastName: string, email: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-rejection-email', {
        body: {
          claimId,
          firstName,
          lastName,
          email,
          rejectionReason
        }
      });

      if (error) throw error;

      console.log('Rejection email sent successfully');
    } catch (error) {
      console.error('Error sending rejection email:', error);
      toast({
        title: "Warning",
        description: "Claim was rejected but failed to send notification email.",
        variant: "destructive"
      });
    }
  };

  const handleClaimUpdate = async () => {
    try {
      const newStatus: ClaimStatus = isEligible ? "in_progress" : "rejected";
      
      const updateData = {
        claim_status: newStatus,
        ...(newStatus === "rejected" ? { rejection_reason: rejectionReason } : {})
      };

      console.log('Updating claim with:', updateData);

      // First, get the claim details for email sending
      const { data: claimData, error: fetchError } = await supabase
        .from('claims')
        .select('first_name, last_name, email')
        .eq('id', claimId)
        .single();

      if (fetchError) throw fetchError;

      // Then update the claim status
      const { error: updateError } = await supabase
        .from('claims')
        .update(updateData)
        .eq('id', claimId);

      if (updateError) throw updateError;

      // If the claim is rejected, send the email
      if (newStatus === "rejected" && claimData) {
        await sendRejectionEmail(
          claimData.first_name,
          claimData.last_name,
          claimData.email
        );
      }

      // Invalidate and immediately refetch all relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['claims'] }),
        queryClient.invalidateQueries({ queryKey: ['claim', claimId] }),
        queryClient.invalidateQueries({ queryKey: ['claimStats'] })
      ]);

      // Force immediate refetch to ensure UI is updated
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['claims'], exact: false }),
        queryClient.refetchQueries({ queryKey: ['claim', claimId] }),
        queryClient.refetchQueries({ queryKey: ['claimStats'] })
      ]);

      toast({
        title: "Success",
        description: `Claim has been marked as ${isEligible ? 'in progress' : 'rejected'}.`
      });

      onStatusUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating claim:', error);
      toast({
        title: "Error",
        description: "Failed to update claim status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isChecking ? "Checking Eligibility..." : 
              isEligible ? "Claim is Eligible" : "Claim not Eligible"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isChecking ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : isEligible ? (
              "The claim meets all eligibility criteria and will be moved to in-progress status."
            ) : (
              <div className="space-y-4">
                <p>The claim does not meet the eligibility criteria.</p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Rejection Reason:
                  </label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="h-32"
                    placeholder="Enter rejection reason..."
                  />
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!isChecking && (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleClaimUpdate}>
                {isEligible ? "Proceed" : "Reject Claim"}
              </Button>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
