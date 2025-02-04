import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const claims = [
  {
    id: "CLM001",
    claimantName: "John Doe",
    dateSubmitted: "2024-03-15",
    lastUpdated: "2024-03-16",
    status: "pending",
    weeklyBenefit: 450,
    employer: "Tech Corp Inc",
    dueDate: "2024-03-30",
  },
  {
    id: "CLM002",
    claimantName: "Jane Smith",
    dateSubmitted: "2024-03-10",
    lastUpdated: "2024-03-14",
    status: "in-progress",
    weeklyBenefit: 500,
    employer: "Marketing Solutions LLC",
    dueDate: "2024-03-25",
  },
  {
    id: "CLM003",
    claimantName: "Alice Johnson",
    dateSubmitted: "2024-03-12",
    lastUpdated: "2024-03-15",
    status: "approved",
    weeklyBenefit: 600,
    employer: "Finance Group",
    dueDate: "2024-03-28",
  },
  {
    id: "CLM004",
    claimantName: "Bob Brown",
    dateSubmitted: "2024-03-11",
    lastUpdated: "2024-03-13",
    status: "rejected",
    weeklyBenefit: 400,
    employer: "Retail Co",
    dueDate: "2024-03-20",
  },
  {
    id: "CLM005",
    claimantName: "Charlie Davis",
    dateSubmitted: "2024-03-09",
    lastUpdated: "2024-03-10",
    status: "pending",
    weeklyBenefit: 450,
    employer: "Construction LLC",
    dueDate: "2024-03-29",
  },
];

const getStatusColor = (status: string) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
};

export function ClaimsList() {
  const navigate = useNavigate();
  const [filteredClaims] = useState(claims);

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Claim ID</TableHead>
            <TableHead className="font-semibold">Claimant Name</TableHead>
            <TableHead className="font-semibold">Date Submitted</TableHead>
            <TableHead className="font-semibold">Last Updated</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Weekly Benefit</TableHead>
            <TableHead className="font-semibold">Employer</TableHead>
            <TableHead className="font-semibold">Due Date</TableHead>
            <TableHead className="font-semibold text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClaims.map((claim) => (
            <TableRow key={claim.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{claim.id}</TableCell>
              <TableCell>{claim.claimantName}</TableCell>
              <TableCell>{claim.dateSubmitted}</TableCell>
              <TableCell>{claim.lastUpdated}</TableCell>
              <TableCell>
                <Badge 
                  className={`${getStatusColor(claim.status)} border`}
                  variant="secondary"
                >
                  {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">${claim.weeklyBenefit}</TableCell>
              <TableCell>{claim.employer}</TableCell>
              <TableCell>{claim.dueDate}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/claims/${claim.id}`)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
