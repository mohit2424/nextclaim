
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClaimsStats } from "@/components/claims/ClaimsStats";
import { ClaimsOverviewChart } from "@/components/dashboard/ClaimsOverviewChart";
import { ClaimsDistributionChart } from "@/components/dashboard/ClaimsDistributionChart";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClaimsList } from "@/components/claims/ClaimsList";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">
              Claims Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and review unemployment claims efficiently
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button onClick={() => navigate("/claims/new")} className="w-full md:w-auto">
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

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="border-b">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 gap-4">
              <h2 className="text-lg font-semibold">Recent Claims</h2>
              <Input
                placeholder="Search claims by SSN..."
                className="w-full md:w-[300px]"
              />
            </div>
          </div>
          <ClaimsList />
        </div>
      </div>
    </DashboardLayout>
  );
}
