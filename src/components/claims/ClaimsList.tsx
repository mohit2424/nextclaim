import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export function ClaimsList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">Claims List</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search claims..."
            className="px-4 py-2 border rounded-md"
          />
          <select className="px-4 py-2 border rounded-md">
            <option value="all">All Claims</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claim ID</TableHead>
              <TableHead>Claimant Name</TableHead>
              <TableHead>Date Submitted</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Weekly Benefit</TableHead>
              <TableHead>Employer</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell className="font-medium">{claim.id}</TableCell>
                <TableCell>{claim.claimantName}</TableCell>
                <TableCell>{claim.dateSubmitted}</TableCell>
                <TableCell>{claim.lastUpdated}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(claim.status)} variant="secondary">
                    {claim.status}
                  </Badge>
                </TableCell>
                <TableCell>${claim.weeklyBenefit}</TableCell>
                <TableCell>{claim.employer}</TableCell>
                <TableCell>{claim.dueDate}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/claims/${claim.id}`)}
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
