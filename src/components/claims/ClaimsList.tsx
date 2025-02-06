
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ClaimsSearchBar } from "./ClaimsSearchBar";
import { ClaimsStatusFilter } from "./ClaimsStatusFilter";
import { ClaimsTable, type ClaimStatus } from "./ClaimsTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ClaimsListProps {
  searchQuery: string;
}

const fetchClaims = async (searchQuery: string = "", status?: string) => {
  let query = supabase
    .from('claims')
    .select('*')
    .order('created_at', { ascending: false });

  if (searchQuery) {
    // Check if the search query matches SSN format (XXX-XX-XXXX)
    const isSSNFormat = /^\d{3}-?\d{2}-?\d{4}$/.test(searchQuery.replace(/-/g, ''));
    
    if (isSSNFormat) {
      // Format the SSN consistently for search
      const formattedSSN = searchQuery.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
      query = query.eq('ssn', formattedSSN);
    } else {
      query = query.or([
        `id.ilike.%${searchQuery}%`,
        `first_name.ilike.%${searchQuery}%`,
        `last_name.ilike.%${searchQuery}%`
      ].join(','));
    }
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
          <h1 className="text-2xl font-semibold text-blue-600">Claims List</h1>
          <img src="/nextclaim-logo.png" alt="NEXTCLAIM" className="h-8" />
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

      <ClaimsTable claims={paginatedClaims} />
    </div>
  );
}
