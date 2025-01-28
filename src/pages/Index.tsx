import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { UsersChart } from "@/components/dashboard/UsersChart";
import { Users, DollarSign, TrendingUp, Building } from "lucide-react";

export default function Index() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your startup.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value="$45,231"
            description="Total revenue this month"
            icon={DollarSign}
            trend="up"
            trendValue="12%"
          />
          <StatsCard
            title="Active Users"
            value="2,420"
            description="Active users this month"
            icon={Users}
            trend="up"
            trendValue="8%"
          />
          <StatsCard
            title="Growth Rate"
            value="14.2%"
            description="Month over month growth"
            icon={TrendingUp}
            trend="down"
            trendValue="3%"
          />
          <StatsCard
            title="Companies"
            value="182"
            description="Companies using our platform"
            icon={Building}
            trend="up"
            trendValue="6%"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart />
          <UsersChart />
        </div>
      </div>
    </DashboardLayout>
  );
}