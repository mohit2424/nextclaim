import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ClaimsList } from "@/components/claims/ClaimsList";
import { ClaimsStats } from "@/components/claims/ClaimsStats";
import { Plus } from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Claims Dashboard</h1>
            <p className="text-muted-foreground">
              Manage and review unemployment claims
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Claim
          </Button>
        </div>
        <ClaimsStats />
        <ClaimsList />
      </div>
    </DashboardLayout>
  );
}