
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ClaimsStatusFilter } from "./ClaimsStatusFilter";

interface ClaimsSearchControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export function ClaimsSearchControls({ 
  searchQuery, 
  onSearchChange, 
  status, 
  onStatusChange 
}: ClaimsSearchControlsProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="relative w-full md:w-96">
        <Input
          type="text"
          placeholder="Search by SSN (XXX-XX-XXXX)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      <ClaimsStatusFilter 
        status={status as any}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}
