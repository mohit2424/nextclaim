
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ClaimsTable, type ClaimStatus } from "./ClaimsTable";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClaimsStatusFilter } from "./ClaimsStatusFilter";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ClaimsListProps {
  searchQuery: string;
}

const fetchClaims = async (searchQuery: string = "", status?: string) => {
  let query = supabase
    .from('claims')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (searchQuery) {
    const cleanSearchQuery = searchQuery.replace(/-/g, '');
    if (/^\d+$/.test(cleanSearchQuery)) {
      query = query.ilike('ssn', `%${cleanSearchQuery}%`);
    } else {
      query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,id.ilike.%${searchQuery}%`);
    }
  }

  if (status) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (status) {
      case 'in_progress':
        query = query.in('claim_status', ['initial_review', 'pending']);
        break;
      case 'today':
        query = query.gte('created_at', today.toISOString());
        break;
      case 'all':
        break;
      default:
        if (['initial_review', 'pending', 'approved', 'rejected'].includes(status)) {
          query = query.eq('claim_status', status as ClaimStatus);
        }
    }
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
};

export function ClaimsList({ searchQuery: initialSearchQuery }: ClaimsListProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearchQuery, setLocalSearchQuery] = useState(initialSearchQuery);
  const statusParam = searchParams.get('status') || 'all';
  const itemsPerPage = 10;

  const { data: claimsData = { data: [], count: 0 }, isLoading, refetch } = useQuery({
    queryKey: ['claims', localSearchQuery, statusParam, currentPage],
    queryFn: () => fetchClaims(localSearchQuery, statusParam),
  });

  const { data: claims, count: totalClaims } = claimsData;
  const totalPages = Math.ceil((totalClaims || 0) / itemsPerPage);

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

  const handleStatusChange = (newStatus: string) => {
    setSearchParams({ status: newStatus });
    setCurrentPage(1); // Reset to first page when changing status
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">Loading claims...</div>
    );
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

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
              onChange={(e) => {
                setLocalSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
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
        <ClaimsTable claims={claims} />
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {getPageNumbers().map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => handlePageChange(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="text-center text-sm text-gray-500 mt-2">
            Showing page {currentPage} of {totalPages} ({totalClaims} total claims)
          </div>
        </div>
      )}
    </div>
  );
}
