import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockClaims = [
  {
    id: 1,
    claimant: "John Doe",
    status: "Pending",
    dateSubmitted: "2024-03-15",
    type: "Regular",
    amount: 1200,
  },
  {
    id: 2,
    claimant: "Jane Smith",
    status: "Approved",
    dateSubmitted: "2024-03-14",
    type: "Emergency",
    amount: 1500,
  },
  {
    id: 3,
    claimant: "Bob Johnson",
    status: "Review",
    dateSubmitted: "2024-03-13",
    type: "Regular",
    amount: 900,
  },
];

export function ClaimsList() {
  const [claims] = useState(mockClaims);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Claimant</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim.id}>
              <TableCell>{claim.claimant}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(claim.status)}
                >
                  {claim.status}
                </Badge>
              </TableCell>
              <TableCell>{claim.dateSubmitted}</TableCell>
              <TableCell>{claim.type}</TableCell>
              <TableCell>${claim.amount}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}