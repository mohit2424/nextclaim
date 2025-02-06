
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

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

  // Check eligibility when component mounts
  useState(() => {
    checkEligibility();
  });

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

  const handleClaimUpdate = async () => {
    try {
      const newStatus = isEligible ? 'in_progress' : 'rejected';
      const updateData: any = {
        claim_status: newStatus
      };

      if (!isEligible) {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('claims')
        .update(updateData)
        .eq('id', claimId);

      if (error) throw error;

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
                {isEligible ? "Close" : "Close Claim"}
              </Button>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
