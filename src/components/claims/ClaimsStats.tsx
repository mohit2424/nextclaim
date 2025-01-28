import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart3, Clock, CheckCircle, XCircle } from "lucide-react";

export function ClaimsStats() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Claims"
        value="1,200"
        description="All claims"
        icon={BarChart3}
        className="bg-blue-500"
        iconClassName="text-white"
      />
      <StatsCard
        title="Pending Claims"
        value="300"
        description="Awaiting review"
        icon={Clock}
        className="bg-orange-500"
        iconClassName="text-white"
      />
      <StatsCard
        title="Approved Claims"
        value="800"
        description="Successfully processed"
        icon={CheckCircle}
        className="bg-green-500"
        iconClassName="text-white"
      />
      <StatsCard
        title="Rejected Claims"
        value="100"
        description="Declined applications"
        icon={XCircle}
        className="bg-red-500"
        iconClassName="text-white"
      />
    </div>
  );
}