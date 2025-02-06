
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SSNSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SSNSearchDialog({ isOpen, onOpenChange }: SSNSearchDialogProps) {
  const navigate = useNavigate();
  const [searchSsn, setSearchSsn] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [existingClaim, setExistingClaim] = useState<null | { id: string }>(null);
  const [ssnError, setSsnError] = useState("");

  const formatSSN = (ssn: string) => {
    const cleaned = ssn.replace(/\D/g, '');
    if (cleaned.length >= 9) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
    }
    return cleaned;
  };

  const checkExistingSSN = async (ssn: string) => {
    setIsSearching(true);
    setSsnError("");
    try {
      const formattedSsn = formatSSN(ssn);
      if (formattedSsn.length !== 11) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                <Button onClick={() => onOpenChange(false)}>
                  Add New Claim
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
