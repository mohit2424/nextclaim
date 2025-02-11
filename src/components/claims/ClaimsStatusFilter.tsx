
import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ClaimStatus = "initial_review" | "pending" | "approved" | "rejected" | "all" | "in_progress";

interface ClaimsStatusFilterProps {
  status: ClaimStatus;
  onStatusChange: (value: ClaimStatus) => void;
}

export function ClaimsStatusFilter({ status, onStatusChange }: ClaimsStatusFilterProps) {
  return (
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="All Claims" />
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Claims</SelectItem>
        <SelectItem value="initial_review">Initial Review</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="approved">Approved</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
}
