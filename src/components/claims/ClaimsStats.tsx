
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay } from "date-fns";

const fetchClaimStats = async () => {
  // Get total claims count
  const { count: totalCount } = await supabase
    .from('claims')
    .select('*', { count: 'exact', head: true });

  // Get in progress claims count
  const { count: inProgressCount } = await supabase
    .from('claims')
    .select('*', { count: 'exact', head: true })
    .eq('claim_status', 'in_progress');

  // Get rejected claims count
  const { count: rejectedCount } = await supabase
    .from('claims')
    .select('*', { count: 'exact', head: true })
    .eq('claim_status', 'rejected');

  // Get new claims today count
  const today = startOfDay(new Date()).toISOString();
  const { count: newTodayCount } = await supabase
    .from('claims')
    .select('*', { count: 'exact', head: true })
    .eq('claim_status', 'initial_review')
    .gte('created_at', today);

  return {
    total: totalCount || 0,
    inProgress: inProgressCount || 0,
    rejected: rejectedCount || 0,
    newToday: newTodayCount || 0
  };
};

export function ClaimsStats() {
  const navigate = useNavigate();
  const { data: claimStats = { total: 0, inProgress: 0, rejected: 0, newToday: 0 }, isLoading } = useQuery({
    queryKey: ['claimStats'],
    queryFn: fetchClaimStats,
    refetchInterval: 3000, // Poll more frequently for dashboard
    staleTime: 0,
  });
  
  const stats = [
    {
      title: "Total Claims",
      value: claimStats.total.toString(),
      bgColor: "bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]",
      textColor: "text-white",
      onClick: () => navigate("/claims?status=all"),
    },
    {
      title: "In Progress",
      value: claimStats.inProgress.toString(),
      bgColor: "bg-gradient-to-r from-[#0EA5E9] to-[#D3E4FD]",
      textColor: "text-white",
      onClick: () => navigate("/claims?status=in_progress"),
    },
    {
      title: "Rejected Claims",
      value: claimStats.rejected.toString(),
      bgColor: "bg-gradient-to-r from-[#D946EF] to-[#FFDEE2]",
      textColor: "text-white",
      onClick: () => navigate("/claims?status=rejected"),
    },
    {
      title: "New Claims Today",
      value: claimStats.newToday.toString(),
      bgColor: "bg-gradient-to-r from-[#8B5CF6] to-[#E5DEFF]",
      textColor: "text-white",
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
            <h3 className="text-sm font-medium text-white/80">
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
