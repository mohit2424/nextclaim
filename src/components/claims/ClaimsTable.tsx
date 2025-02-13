import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EligibilityCheckDialog } from "./EligibilityCheckDialog";

export type ClaimStatus = "initial_review" | "in_progress" | "rejected";
export type SeparationReason = "resignation" | "termination_misconduct" | "layoff" | "reduction_in_force" | "constructive_discharge" | "job_abandonment" | "severance_agreement";

type Claim = {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  claim_status: ClaimStatus;
  employer_name: string;
  claim_date: string;
  ssn: string;
  employment_start_date: string | null;
  employment_end_date: string | null;
  separation_reason: SeparationReason;
  rejection_reason?: string | null;
};

interface ClaimsTableProps {
  claims: Claim[];
  onStatusUpdate?: () => void;
}

const getStatusColor = (status: ClaimStatus) => {
  const colors = {
    initial_review: "bg-yellow-100 text-yellow-800 border-yellow-200",
    in_progress: "bg-purple-100 text-purple-800 border-purple-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

export function ClaimsTable({ claims, onStatusUpdate }: ClaimsTableProps) {
  const navigate = useNavigate();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const handleEligibilityCheck = (claim: Claim) => {
    setSelectedClaim(claim);
  };

  const formatSeparationReason = (reason: SeparationReason) => {
    return reason.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const maskSSN = (ssn: string) => {
    return `XXX-XX-${ssn.slice(-4)}`;
  };

  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm w-full">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Claim ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Claimant Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Date Submitted</TableHead>
                <TableHead className="font-semibold text-gray-700">Last Updated</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Employer</TableHead>
                <TableHead className="font-semibold text-gray-700">Due Date</TableHead>
                <TableHead className="font-semibold text-gray-700">SSN</TableHead>
                <TableHead className="font-semibold text-gray-700">Separation Reason</TableHead>
                <TableHead className="font-semibold text-gray-700 w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{claim.id}</TableCell>
                  <TableCell>{`${claim.first_name} ${claim.last_name}`}</TableCell>
                  <TableCell>{new Date(claim.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(claim.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge 
                      className={`${getStatusColor(claim.claim_status)} border`}
                      variant="secondary"
                    >
                      {claim.claim_status.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{claim.employer_name}</TableCell>
                  <TableCell>{new Date(claim.claim_date).toLocaleDateString()}</TableCell>
                  <TableCell>{maskSSN(claim.ssn)}</TableCell>
                  <TableCell>{formatSeparationReason(claim.separation_reason)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/claims/${claim.id}`)}
                      >
                        View Details
                      </Button>
                      {claim.claim_status === "initial_review" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleEligibilityCheck(claim)}
                        >
                          Check Eligibility
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedClaim && (
        <EligibilityCheckDialog
          claimId={selectedClaim.id}
          employmentStartDate={selectedClaim.employment_start_date}
          employmentEndDate={selectedClaim.employment_end_date}
          onClose={() => setSelectedClaim(null)}
          onStatusUpdate={onStatusUpdate}
        />
      )}
    </>
  );
}
