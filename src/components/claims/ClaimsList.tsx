
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ClaimsSearchBar } from "./ClaimsSearchBar";
import { ClaimsStatusFilter } from "./ClaimsStatusFilter";
import { ClaimsTable, type ClaimStatus } from "./ClaimsTable";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";

interface ClaimsListProps {
  searchQuery: string;
}

const fetchClaims = async (searchQuery: string = "", status?: string) => {
  let query = supabase
    .from('claims')
    .select('*')
    .order('created_at', { ascending: false });

  if (searchQuery) {
    // Remove any hyphens from the search query for consistent comparison
    const cleanSearchQuery = searchQuery.replace(/-/g, '');
    
    // If the search query contains only numbers, treat it as potential SSN
    if (/^\d+$/.test(cleanSearchQuery)) {
      query = query.ilike('ssn', `%${cleanSearchQuery}%`);
    } else {
      // For non-numeric queries, search other fields
      query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,id.ilike.%${searchQuery}%`);
    }
  }

  if (status && status !== 'all') {
    if (status === 'in_progress') {
      query = query.in('claim_status', ['initial_review', 'pending']);
    } else if (status === 'today') {
      const today = startOfDay(new Date()).toISOString();
      query = query.gte('created_at', today);
    } else {
      query = query.eq('claim_status', status as ClaimStatus);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export function ClaimsList({ searchQuery: initialSearchQuery }: ClaimsListProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearchQuery, setLocalSearchQuery] = useState(initialSearchQuery);
  const statusParam = searchParams.get('status') || 'all';
  const itemsPerPage = 10;

  const { data: claims = [], isLoading, refetch } = useQuery({
    queryKey: ['claims', localSearchQuery, statusParam],
    queryFn: () => fetchClaims(localSearchQuery, statusParam),
  });

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claims'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const totalPages = Math.ceil(claims.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClaims = claims.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = (newStatus: string) => {
    setSearchParams({ status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">Loading claims...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 
              className="text-2xl font-semibold text-blue-600 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              Claims List
            </h1>
          </div>
          <h2 className="text-xl font-bold text-blue-600">
            NEXTCLAIM
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96">
            <Input
              type="text"
              placeholder="Search by SSN (XXX-XX-XXXX)"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <ClaimsStatusFilter 
            status={statusParam as any}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto">
        <ClaimsTable claims={paginatedClaims} />
      </div>
    </div>
  );
}
