
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ClaimStatus } from "./ClaimsTable";
import { startOfDay } from "date-fns";

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
      // For SSN search, match from the beginning
      query = query.ilike('ssn', `${cleanSearchQuery}%`);
    } else {
      // For name search, match from the beginning of first or last name
      query = query.or(`first_name.ilike.${searchQuery}%,last_name.ilike.${searchQuery}%,id.eq.${searchQuery}`);
    }
  }

  if (status) {
    const today = startOfDay(new Date()).toISOString();

    switch (status) {
      case 'in_progress':
        query = query.eq('claim_status', 'in_progress');
        break;
      case 'rejected':
        query = query.eq('claim_status', 'rejected');
        break;
      case 'today':
        query = query
          .eq('claim_status', 'initial_review')
          .gte('created_at', today);
        break;
      case 'all':
        break;
      default:
        if (['initial_review'].includes(status)) {
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
    refetchInterval: 5000,
  });
};
