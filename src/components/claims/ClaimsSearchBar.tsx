
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ClaimsSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ClaimsSearchBar({ searchQuery, onSearchChange }: ClaimsSearchBarProps) {
  return (
    <div className="relative w-full md:w-[300px]">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search claims..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
