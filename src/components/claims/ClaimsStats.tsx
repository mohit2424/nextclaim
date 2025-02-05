
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ClaimStatusCount = {
  claim_status: string;
  count: number;
};

const fetchClaimStats = async () => {
  const { data: totalClaims } = await supabase
    .from('claims')
    .select('claim_status')
    .order('created_at', { ascending: false });

  if (!totalClaims) return [];

  const statusCounts = totalClaims.reduce((acc: { [key: string]: number }, claim) => {
    acc[claim.claim_status] = (acc[claim.claim_status] || 0) + 1;
    return acc;
  }, {});

  return statusCounts;
};

export function ClaimsStats() {
  const navigate = useNavigate();
  const { data: claimStats = {}, isLoading } = useQuery({
    queryKey: ['claimStats'],
    queryFn: fetchClaimStats,
  });
  
  const stats = [
    {
      title: "Total Claims",
      value: Object.values(claimStats).reduce((a: number, b: number) => a + b, 0).toString(),
      bgColor: "bg-gradient-to-r from-blue-50 to-blue-100",
      textColor: "text-blue-900",
      onClick: () => navigate("/claims"),
    },
    {
      title: "Initial Review",
      value: (claimStats['initial_review'] || 0).toString(),
      bgColor: "bg-gradient-to-r from-orange-50 to-orange-100",
      textColor: "text-orange-900",
      onClick: () => navigate("/claims?status=initial_review"),
    },
    {
      title: "Pending",
      value: (claimStats['pending'] || 0).toString(),
      bgColor: "bg-gradient-to-r from-purple-50 to-purple-100",
      textColor: "text-purple-900",
      onClick: () => navigate("/claims?status=pending"),
    },
    {
      title: "Approved Claims",
      value: (claimStats['approved'] || 0).toString(),
      bgColor: "bg-gradient-to-r from-green-50 to-green-100",
      textColor: "text-green-900",
      onClick: () => navigate("/claims?status=approved"),
    },
    {
      title: "Rejected Claims",
      value: (claimStats['rejected'] || 0).toString(),
      bgColor: "bg-gradient-to-r from-red-50 to-red-100",
      textColor: "text-red-900",
      onClick: () => navigate("/claims?status=rejected"),
    },
  ];

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="animate-pulse bg-gray-100 h-[104px]" />
      ))}
    </div>;
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
