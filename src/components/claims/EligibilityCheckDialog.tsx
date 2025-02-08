
import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface EligibilityCheckDialogProps {
  claimId: string;
  employmentStartDate: string | null;
  employmentEndDate: string | null;
  onClose: () => void;
  onStatusUpdate: () => void;
}

type ClaimStatus = "initial_review" | "in_progress" | "rejected";

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
      const { data, error } = await supabase.rpc('check_claim_eligibility', {
        start_date: employmentStartDate,
        end_date: employmentEndDate
      });

      if (error) throw error;

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

  const handleClaimUpdate = async () => {
    try {
      const newStatus: ClaimStatus = isEligible ? "in_progress" : "rejected";
      
      const updateData = {
        claim_status: newStatus,
        ...(newStatus === "rejected" ? { rejection_reason: rejectionReason } : {})
      };

      const { error } = await supabase
        .from('claims')
        .update(updateData)
        .eq('id', claimId);

      if (error) throw error;

      // Invalidate all relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['claims'] }),
        queryClient.invalidateQueries({ queryKey: ['claimStats'] }),
        queryClient.invalidateQueries({ queryKey: ['claim', claimId] })
      ]);

      // Force immediate refetch
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['claims'] }),
        queryClient.refetchQueries({ queryKey: ['claimStats'] }),
        queryClient.refetchQueries({ queryKey: ['claim', claimId] })
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
          <AlertDialogDescription className="space-y-4">
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
                    Rejection Reason (max 250 words):
                  </label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => {
                      const words = e.target.value.trim().split(/\s+/);
                      if (words.length <= 250) {
                        setRejectionReason(e.target.value);
                      }
                    }}
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
