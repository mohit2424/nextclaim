import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockClaims = [
  {
    id: "12345",
    claimant: "John Doe",
    status: "Pending",
    dateSubmitted: "2024-03-15",
    dueDate: "2 days to go",
  },
  {
    id: "67890",
    claimant: "Jane Smith",
    status: "Approved",
    dateSubmitted: "2024-03-20",
    dueDate: "Overdue",
  },
  {
    id: "11223",
    claimant: "Alice Johnson",
    status: "Denied",
    dateSubmitted: "2024-03-05",
    dueDate: "5 days to go",
  },
  {
    id: "44556",
    claimant: "Bob Brown",
    status: "Pending",
    dateSubmitted: "2024-03-10",
    dueDate: "7 days to go",
  },
];

export function ClaimsList() {
  const [claims] = useState(mockClaims);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "denied":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CLAIM ID</TableHead>
            <TableHead>CLAIMANT NAME</TableHead>
            <TableHead>DATE SUBMITTED</TableHead>
            <TableHead>DUE DATE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim.id}>
              <TableCell className="font-medium">{claim.id}</TableCell>
              <TableCell>{claim.claimant}</TableCell>
              <TableCell>{claim.dateSubmitted}</TableCell>
              <TableCell>{claim.dueDate}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(claim.status)}
                >
                  {claim.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => navigate(`/claims/${claim.id}`)}
                >
                  <Eye className="h-4 w-4 mr-1" />
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