
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay } from "date-fns";

const fetchClaimStats = async () => {
  const { data: claims } = await supabase
    .from('claims')
    .select('claim_status, created_at')
    .order('created_at', { ascending: false });

  if (!claims) return { total: 0, inProgress: 0, newToday: 0 };

  const today = startOfDay(new Date());
  
  const stats = claims.reduce((acc: any, claim) => {
    // Total claims
    acc.total++;
    
    // In progress claims (initial_review, pending)
    if (['initial_review', 'pending'].includes(claim.claim_status)) {
      acc.inProgress++;
    }
    
    // New claims today
    if (new Date(claim.created_at) >= today) {
      acc.newToday++;
    }
    
    return acc;
  }, { total: 0, inProgress: 0, newToday: 0 });

  return stats;
};

export function ClaimsStats() {
  const navigate = useNavigate();
  const { data: claimStats = { total: 0, inProgress: 0, newToday: 0 }, isLoading } = useQuery({
    queryKey: ['claimStats'],
    queryFn: fetchClaimStats,
  });
  
  const stats = [
    {
      title: "Total Claims",
      value: claimStats.total.toString(),
      bgColor: "bg-gradient-to-r from-blue-50 to-blue-100",
      textColor: "text-blue-900",
      onClick: () => navigate("/claims"),
    },
    {
      title: "In Progress",
      value: claimStats.inProgress.toString(),
      bgColor: "bg-gradient-to-r from-purple-50 to-purple-100",
      textColor: "text-purple-900",
      onClick: () => navigate("/claims?status=in_progress"),
    },
    {
      title: "New Claims Today",
      value: claimStats.newToday.toString(),
      bgColor: "bg-gradient-to-r from-green-50 to-green-100",
      textColor: "text-green-900",
      onClick: () => navigate("/claims"),
    },
  ];

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse bg-gray-100 h-[104px]" />
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
