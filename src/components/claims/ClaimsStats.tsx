import { Card } from "@/components/ui/card";

export function ClaimsStats() {
  const stats = [
    {
      title: "Total Claims",
      value: "1200",
      bgColor: "bg-gradient-to-r from-blue-50 to-blue-100",
      textColor: "text-blue-900",
    },
    {
      title: "Pending Claims",
      value: "300",
      bgColor: "bg-gradient-to-r from-orange-50 to-orange-100",
      textColor: "text-orange-900",
    },
    {
      title: "In Progress",
      value: "150",
      bgColor: "bg-gradient-to-r from-purple-50 to-purple-100",
      textColor: "text-purple-900",
    },
    {
      title: "Approved Claims",
      value: "650",
      bgColor: "bg-gradient-to-r from-green-50 to-green-100",
      textColor: "text-green-900",
    },
    {
      title: "Rejected Claims",
      value: "100",
      bgColor: "bg-gradient-to-r from-red-50 to-red-100",
      textColor: "text-red-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={`${stat.bgColor} border-none shadow-sm`}
        >
          <div className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </h3>
            <p className={`text-2xl font-bold mt-2 ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}