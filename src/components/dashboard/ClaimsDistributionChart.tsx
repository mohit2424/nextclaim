
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const COLORS = ["#60A5FA", "#93C5FD", "#BFDBFE", "#F87171", "#FCD34D", "#4ADE80"];

const fetchClaimsDistribution = async (year: string) => {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  
  const { data: claims } = await supabase
    .from('claims')
    .select('claim_status')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (!claims) return [];

  const distribution = claims.reduce((acc: any, claim) => {
    const status = claim.claim_status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(distribution).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    value
  }));
};

export function ClaimsDistributionChart() {
  const [selectedYear, setSelectedYear] = useState("2024");
  
  const { data: distributionData = [], isLoading } = useQuery({
    queryKey: ['claimsDistribution', selectedYear],
    queryFn: () => fetchClaimsDistribution(selectedYear),
  });

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
        <h3 className="text-lg font-semibold">Claims Distribution</h3>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({name, value}) => `${name}: ${value}`}
            >
              {distributionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
