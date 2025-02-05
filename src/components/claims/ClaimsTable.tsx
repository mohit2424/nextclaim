
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export type ClaimStatus = "initial_review" | "pending" | "approved" | "rejected";

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
    initial_review: "bg-yellow-100 text-yellow-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export function ClaimsTable({ claims }: ClaimsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-semibold">Claim ID</TableHead>
            <TableHead className="font-semibold">Claimant Name</TableHead>
            <TableHead className="font-semibold">Date Submitted</TableHead>
            <TableHead className="font-semibold">Last Updated</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Employer</TableHead>
            <TableHead className="font-semibold">Due Date</TableHead>
            <TableHead className="font-semibold w-[100px]">Action</TableHead>
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
                  className={`${getStatusColor(claim.claim_status)}`}
                  variant="secondary"
                >
                  {claim.claim_status.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Badge>
              </TableCell>
              <TableCell>{claim.employer_name}</TableCell>
              <TableCell>{new Date(claim.claim_date).toLocaleDateString()}</TableCell>
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
  );
}
