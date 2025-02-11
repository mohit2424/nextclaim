
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ClaimsTable } from "./ClaimsTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClaimsHeader } from "./ClaimsHeader";
import { ClaimsSearchControls } from "./ClaimsSearchControls";
import { ClaimsPagination } from "./ClaimsPagination";
import { useClaims } from "@/hooks/useClaims";

interface ClaimsListProps {
  searchQuery: string;
}

export function ClaimsList({ searchQuery: initialSearchQuery }: ClaimsListProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearchQuery, setLocalSearchQuery] = useState(initialSearchQuery);
  const statusParam = searchParams.get('status') || 'all';
  const itemsPerPage = 10;

  const { data: claimsData = { data: [], count: 0 }, isLoading, refetch } = useClaims({
    searchQuery: localSearchQuery,
    status: statusParam,
    page: currentPage,
    pageSize: itemsPerPage
  });

  const { data: claims, count: totalClaims } = claimsData;
  const totalPages = Math.ceil((totalClaims || 0) / itemsPerPage);

  // Set up real-time subscription
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
          <ClaimsHeader />
          <ClaimsSearchControls
            searchQuery={localSearchQuery}
            onSearchChange={setLocalSearchQuery}
            status={statusParam}
            onStatusChange={handleStatusChange}
          />
        </div>

        <div className="max-w-[1200px] mx-auto">
          <ClaimsTable claims={claims} />
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
