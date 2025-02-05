
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

const monthlyData = [
  { month: "Jan", claims: 280 },
  { month: "Feb", claims: 150 },
  { month: "Mar", claims: 650 },
  { month: "Apr", claims: 100 },
  { month: "May", claims: 400 },
  { month: "Jun", claims: 200 },
  { month: "Jul", claims: 520 },
  { month: "Aug", claims: 300 },
  { month: "Sep", claims: 450 },
  { month: "Oct", claims: 250 },
  { month: "Nov", claims: 600 },
  { month: "Dec", claims: 350 },
];

const yearlyData = [
  { year: "2020", claims: 2500 },
  { year: "2021", claims: 3200 },
  { year: "2022", claims: 4100 },
  { year: "2023", claims: 3800 },
  { year: "2024", claims: 1500 },
];

export function ClaimsOverviewChart() {
  const [isMonthly, setIsMonthly] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2024");

  const data = isMonthly ? monthlyData : yearlyData;
  const xAxisKey = isMonthly ? "month" : "year";

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
