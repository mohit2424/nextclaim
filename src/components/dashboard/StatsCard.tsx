import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down";
  trendValue?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
}: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend && trendValue && (
            <p className="text-sm mt-1">
              <span
                className={cn(
                  "inline-flex items-center gap-1",
                  trend === "up" ? "text-green-600" : "text-red-600"
                )}
              >
                {trend === "up" ? "↑" : "↓"} {trendValue}
              </span>{" "}
              vs last month
            </p>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-4">{description}</p>
    </Card>
  );
}