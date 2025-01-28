import { StatsCard } from "@/components/dashboard/StatsCard";
import { ClipboardList, Clock, CheckCircle, AlertCircle } from "lucide-react";

export function ClaimsStats() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Claims"
        value="156"
        description="Claims this month"
        icon={ClipboardList}
        trend="up"
        trendValue="12%"
      />
      <StatsCard
        title="Pending Review"
        value="23"
        description="Claims awaiting review"
        icon={Clock}
        trend="down"
        trendValue="5%"
      />
      <StatsCard
        title="Approved"
        value="98"
        description="Claims approved this month"
        icon={CheckCircle}
        trend="up"
        trendValue="8%"
      />
      <StatsCard
        title="Flagged"
        value="35"
        description="Claims requiring attention"
        icon={AlertCircle}
        trend="up"
        trendValue="2%"
      />
    </div>
  );
}