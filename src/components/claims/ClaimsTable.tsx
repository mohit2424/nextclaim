
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export type ClaimStatus = "initial_review" | "in_progress" | "rejected";

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
};

interface ClaimsTableProps {
  claims: Claim[];
}

const getStatusColor = (status: ClaimStatus) => {
  const colors = {
    initial_review: "bg-yellow-100 text-yellow-800 border-yellow-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

export function ClaimsTable({ claims }: ClaimsTableProps) {
  const navigate = useNavigate();

  return (
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
              <TableHead className="font-semibold text-gray-700 w-[100px]">Action</TableHead>
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
                <TableCell>{claim.ssn}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/claims/${claim.id}`)}
                    className="w-full"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
