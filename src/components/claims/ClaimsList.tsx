
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClaimsSearchBar } from "./ClaimsSearchBar";
import { ClaimsStatusFilter } from "./ClaimsStatusFilter";
import { ClaimsTable, type ClaimStatus } from "./ClaimsTable";

interface ClaimsListProps {
  searchQuery: string;
}

const fetchClaims = async (searchQuery: string = "", status?: string) => {
  let query = supabase
    .from('claims')
    .select('*')
    .order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.or([
      `id.ilike.%${searchQuery}%`,
      `first_name.ilike.%${searchQuery}%`,
      `last_name.ilike.%${searchQuery}%`,
      `ssn.ilike.%${searchQuery}%`
    ].join(','));
  }

  if (status && status !== 'all') {
    if (status === 'in_progress') {
      query = query.in('claim_status', ['initial_review', 'pending']);
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
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-blue-600">Claims List</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <ClaimsSearchBar 
            searchQuery={localSearchQuery}
            onSearchChange={setLocalSearchQuery}
          />
          <ClaimsStatusFilter 
            status={statusParam as any}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      <ClaimsTable claims={paginatedClaims} />
    </div>
  );
}
