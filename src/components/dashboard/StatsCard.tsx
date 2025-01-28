import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  iconClassName?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  iconClassName,
}: StatsCardProps) {
  return (
    <Card className={cn("p-6 text-white", className)}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/10 rounded-full">
          <Icon className={cn("w-5 h-5", iconClassName)} />
        </div>
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-sm text-white/80 mt-1">{description}</p>
        </div>
      </div>
    </Card>
  );
}