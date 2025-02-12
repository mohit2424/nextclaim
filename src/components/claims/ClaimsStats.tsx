
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay } from "date-fns";

const fetchClaimStats = async () => {
  const { data: claims, error } = await supabase
    .from('claims')
    .select('claim_status, created_at');

  if (error) throw error;
  if (!claims) return { total: 0, inProgress: 0, newToday: 0, rejected: 0 };

  const today = startOfDay(new Date());
  
  const stats = claims.reduce((acc: any, claim) => {
    // Total claims
    acc.total++;
    
    // In progress claims
    if (claim.claim_status === 'in_progress') {
      acc.inProgress++;
    }
    
    // Rejected claims
    if (claim.claim_status === 'rejected') {
      acc.rejected++;
    }
    
    // New claims today (initial_review status created today)
    if (new Date(claim.created_at) >= today && claim.claim_status === 'initial_review') {
      acc.newToday++;
    }
    
    return acc;
  }, { total: 0, inProgress: 0, rejected: 0, newToday: 0 });

  return stats;
};

export function ClaimsStats() {
  const navigate = useNavigate();
  const { data: claimStats = { total: 0, inProgress: 0, rejected: 0, newToday: 0 }, isLoading } = useQuery({
    queryKey: ['claimStats'],
    queryFn: fetchClaimStats,
    refetchInterval: 3000, // Poll more frequently
    staleTime: 0, // Consider data always stale to enable immediate refetches
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
      title: "Rejected Claims",
      value: claimStats.rejected.toString(),
      bgColor: "bg-gradient-to-r from-red-50 to-red-100",
      textColor: "text-red-900",
      onClick: () => navigate("/claims?status=rejected"),
    },
    {
      title: "New Claims Today",
      value: claimStats.newToday.toString(),
      bgColor: "bg-gradient-to-r from-green-50 to-green-100",
      textColor: "text-green-900",
      onClick: () => navigate("/claims?status=today"),
    },
  ];

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse bg-gray-100 h-[104px]" />
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
