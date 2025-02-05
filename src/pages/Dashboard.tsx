
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClaimsStats } from "@/components/claims/ClaimsStats";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClaimsList } from "@/components/claims/ClaimsList";
import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Claims Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and review unemployment claims efficiently
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by ID, Name, or SSN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => navigate("/claims/new")} className="whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              New Claim
            </Button>
          </div>
        </div>

        <ClaimsStats />

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Recent Claims</h2>
          </div>
          <ClaimsList searchQuery={searchQuery} />
        </div>
      </div>
    </DashboardLayout>
  );
}
