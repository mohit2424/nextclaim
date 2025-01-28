import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ClaimsList } from "@/components/claims/ClaimsList";
import { ClaimsStats } from "@/components/claims/ClaimsStats";
import { Plus } from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome to NextClaim</h1>
            <p className="text-muted-foreground mt-1">
              Manage and review unemployment claims
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Claim
          </Button>
        </div>
        <ClaimsStats />
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Claims Trend</h2>
            <div className="flex gap-2 mb-4">
              <Button variant="secondary" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                Weekly
              </Button>
              <Button variant="outline" size="sm">
                Monthly
              </Button>
            </div>
            {/* Chart would go here */}
          </div>
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Claims Distribution</h2>
            {/* Pie chart would go here */}
          </div>
        </div>
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Claims Overview</h2>
          </div>
          <ClaimsList />
        </div>
      </div>
    </DashboardLayout>
  );
}