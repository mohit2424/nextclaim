
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ClaimStatus } from "./ClaimsTable";

export const fetchClaims = async (
  searchQuery: string = "", 
  status?: string, 
  page: number = 1,
  pageSize: number = 10
) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from('claims')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(start, end);

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
        query = query.eq('claim_status', 'in_progress');
        break;
      case 'today':
        // Use gte with the start of today in ISO format
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

export const useClaimsList = (
  searchQuery: string,
  status: string,
  currentPage: number
) => {
  return useQuery({
    queryKey: ['claims', searchQuery, status, currentPage],
    queryFn: () => fetchClaims(searchQuery, status, currentPage),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 1000, // Poll every second to ensure we catch all updates
  });
};
