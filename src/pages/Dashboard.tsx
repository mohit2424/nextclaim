import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ClaimsOverviewChart } from "@/components/dashboard/ClaimsOverviewChart";
import { ClaimsDistributionChart } from "@/components/dashboard/ClaimsDistributionChart";
import { ClaimsStats } from "@/components/claims/ClaimsStats";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const [isImporting, setIsImporting] = useState(false);
  const importNASWAClaims = async () => {
    try {
      setIsImporting(true);
      const {
        data,
        error
      } = await supabase.functions.invoke('naswa-claims');
      if (error) throw error;
      if (data.success) {
        toast.success('Successfully imported NASWA claims');
        // Invalidate the claims query to refresh the data
        await queryClient.invalidateQueries({
          queryKey: ['claims']
        });
        await queryClient.invalidateQueries({
          queryKey: ['claimStats']
        });
      } else {
        throw new Error('Failed to import claims');
      }
    } catch (error) {
      console.error('Error importing NASWA claims:', error);
      toast.error('Failed to import NASWA claims');
    } finally {
      setIsImporting(false);
    }
  };
  return <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Mohit</h1>
            <p className="text-muted-foreground mt-1">
              Manage and review unemployment claims efficiently
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input placeholder="Search claims..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Button variant="outline" onClick={importNASWAClaims} disabled={isImporting} className="whitespace-nowrap">
              {isImporting ? 'Importing...' : 'Import NASWA Claims'}
            </Button>
            <Button onClick={() => navigate("/claims/new")} className="whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              New Claim
            </Button>
          </div>
        </div>

        <ClaimsStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClaimsOverviewChart />
          <ClaimsDistributionChart />
        </div>
      </div>
    </DashboardLayout>;
}