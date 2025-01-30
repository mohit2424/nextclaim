import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useClaims } from "@/hooks/useClaims";

export function ClaimsStats() {
  const navigate = useNavigate();
  const { claims, isLoading } = useClaims();
  
  const getClaimsByStatus = (status: string) => {
    return claims?.filter(claim => claim.status === status).length || 0;
  };

  const stats = [
    {
      title: "Total Claims",
      value: claims?.length.toString() || "0",
      bgColor: "bg-gradient-to-r from-blue-50 to-blue-100",
      textColor: "text-blue-900",
      onClick: () => navigate("/claims"),
    },
    {
      title: "Pending Claims",
      value: getClaimsByStatus("pending").toString(),
      bgColor: "bg-gradient-to-r from-orange-50 to-orange-100",
      textColor: "text-orange-900",
    },
    {
      title: "In Progress",
      value: getClaimsByStatus("in_progress").toString(),
      bgColor: "bg-gradient-to-r from-purple-50 to-purple-100",
      textColor: "text-purple-900",
    },
    {
      title: "Approved Claims",
      value: getClaimsByStatus("approved").toString(),
      bgColor: "bg-gradient-to-r from-green-50 to-green-100",
      textColor: "text-green-900",
    },
    {
      title: "Rejected Claims",
      value: getClaimsByStatus("rejected").toString(),
      bgColor: "bg-gradient-to-r from-red-50 to-red-100",
      textColor: "text-red-900",
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={`${stat.bgColor} border-none shadow-sm cursor-pointer transition-transform hover:scale-105`}
          onClick={stat.onClick}
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