
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClaimsStats } from "@/components/claims/ClaimsStats";
import { ClaimsOverviewChart } from "@/components/dashboard/ClaimsOverviewChart";
import { ClaimsDistributionChart } from "@/components/dashboard/ClaimsDistributionChart";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              Welcome to Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage and review unemployment claims
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search claims..."
                className="pl-8 w-[300px]"
              />
            </div>
            <Button onClick={() => navigate("/claims/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Claim
            </Button>
          </div>
        </div>

        <ClaimsStats />

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ClaimsOverviewChart />
          <ClaimsDistributionChart />
        </div>

        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Claims</h2>
          </div>
          {/* ClaimsList component will be rendered here */}
        </div>
      </div>
    </DashboardLayout>
  );
}
