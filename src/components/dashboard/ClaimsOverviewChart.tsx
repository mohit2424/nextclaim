
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, format, subMonths, startOfYear, endOfYear, subYears } from "date-fns";

const fetchMonthlyData = async (year: string) => {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  
  const { data: claims } = await supabase
    .from('claims')
    .select('created_at')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (!claims) return [];

  // Initialize all months with 0
  const monthsData = Array.from({ length: 12 }, (_, i) => ({
    month: format(new Date(parseInt(year), i), 'MMM'),
    claims: 0
  }));

  // Count claims per month
  claims.forEach(claim => {
    const monthIndex = new Date(claim.created_at).getMonth();
    monthsData[monthIndex].claims++;
  });

  return monthsData;
};

const fetchYearlyData = async () => {
  const currentYear = new Date().getFullYear();
  const fiveYearsAgo = currentYear - 4;
  
  const { data: claims } = await supabase
    .from('claims')
    .select('created_at')
    .gte('created_at', `${fiveYearsAgo}-01-01`);

  if (!claims) return [];

  // Initialize years with 0
  const yearsData = Array.from({ length: 5 }, (_, i) => ({
    year: (fiveYearsAgo + i).toString(),
    claims: 0
  }));

  // Count claims per year
  claims.forEach(claim => {
    const year = new Date(claim.created_at).getFullYear();
    const yearIndex = year - fiveYearsAgo;
    if (yearIndex >= 0 && yearIndex < 5) {
      yearsData[yearIndex].claims++;
    }
  });

  return yearsData;
};

export function ClaimsOverviewChart() {
  const [isMonthly, setIsMonthly] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const { data: monthlyData = [], isLoading: isLoadingMonthly } = useQuery({
    queryKey: ['monthlyClaimsData', selectedYear],
    queryFn: () => fetchMonthlyData(selectedYear),
    enabled: isMonthly
  });

  const { data: yearlyData = [], isLoading: isLoadingYearly } = useQuery({
    queryKey: ['yearlyClaimsData'],
    queryFn: fetchYearlyData,
    enabled: !isMonthly
  });

  const data = isMonthly ? monthlyData : yearlyData;
  const xAxisKey = isMonthly ? "month" : "year";
  const isLoading = isMonthly ? isLoadingMonthly : isLoadingYearly;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
          <div className="h-[300px] bg-gray-100 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-semibold">Claims Overview</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="monthly"
              checked={isMonthly}
              onCheckedChange={setIsMonthly}
            />
            <Label htmlFor="monthly">{isMonthly ? "Monthly" : "Yearly"}</Label>
          </div>
          {isMonthly && (
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="claims"
              fill="rgba(59, 130, 246, 0.8)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
