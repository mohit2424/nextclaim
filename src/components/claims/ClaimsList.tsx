
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ClaimsTable } from "./ClaimsTable";
import { ClaimsStatusFilter } from "./ClaimsStatusFilter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClaimsListHeader } from "./ClaimsListHeader";
import { ClaimsPagination } from "./ClaimsPagination";
import { useClaimsList } from "./useClaimsList";
import { useQueryClient } from "@tanstack/react-query";

interface ClaimsListProps {
  searchQuery: string;
}

export function ClaimsList({ searchQuery: initialSearchQuery }: ClaimsListProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialSearchQuery);
  const statusParam = searchParams.get('status') || 'all';
  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Delay search by 500ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: claimsData = { data: [], count: 0 }, isLoading } = useClaimsList(
    debouncedSearchQuery,
    statusParam,
    currentPage
  );

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
        async () => {
          // Immediately invalidate and refetch
          await queryClient.invalidateQueries({ queryKey: ['claims'] });
          await queryClient.refetchQueries({ queryKey: ['claims'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleStatusChange = (newStatus: string) => {
    setSearchParams({ status: newStatus });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Loading claims...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex flex-col gap-6">
          <ClaimsListHeader />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <Input
                type="text"
                placeholder="Search by SSN (XXX-XX-XXXX) or Name"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <ClaimsStatusFilter 
              status={statusParam}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto">
          <ClaimsTable 
            claims={claims} 
            onStatusUpdate={() => {
              queryClient.invalidateQueries({ queryKey: ['claims'] });
              queryClient.refetchQueries({ queryKey: ['claims'] });
            }}
          />
        </div>

        <ClaimsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalClaims={totalClaims}
          onPageChange={handlePageChange}
        />
      </div>
    </DashboardLayout>
  );
}
