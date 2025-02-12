
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
  console.log('Fetching claims for year:', year);
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  
  const { data: claims, error } = await supabase
    .from('claims')
    .select('claim_status')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (error) {
    console.error('Error fetching claims:', error);
    throw error;
  }

  console.log('Fetched claims:', claims);

  if (!claims || claims.length === 0) return [];

  const distribution = claims.reduce((acc: any, claim) => {
    const status = claim.claim_status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(distribution).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    value
  }));

  console.log('Processed distribution data:', data);
  return data;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${name}: ${value}`}
    </text>
  );
};

export function ClaimsDistributionChart() {
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const { data: distributionData = [], isLoading, error } = useQuery({
    queryKey: ['claimsDistribution', selectedYear],
    queryFn: () => fetchClaimsDistribution(selectedYear),
  });

  if (error) {
    console.error('Error in ClaimsDistributionChart:', error);
    return (
      <Card className="p-6">
        <div className="text-red-500">Error loading claims distribution</div>
      </Card>
    );
  }

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

  if (!distributionData.length) {
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
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No claims data available for {selectedYear}
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
            <SelectItem value="2022">2022</SelectItem>
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
              label={CustomLabel}
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
