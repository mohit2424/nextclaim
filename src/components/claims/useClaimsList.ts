
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
    .select('*', { count: 'exact' });

  // Base search functionality
  if (searchQuery) {
    const cleanSearchQuery = searchQuery.replace(/-/g, '');
    if (/^\d+$/.test(cleanSearchQuery)) {
      query = query.ilike('ssn', `%${cleanSearchQuery}%`);
    } else {
      query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,id.ilike.%${searchQuery}%`);
    }
  }

  // Handle different status filters
  if (status) {
    switch (status) {
      case 'in_progress': {
        const { data: inProgressIds } = await supabase
          .from('in_progress_claims')
          .select('claim_id');
        const ids = inProgressIds?.map(record => record.claim_id) || [];
        query = query.in('id', ids);
        break;
      }
      case 'rejected': {
        const { data: rejectedIds } = await supabase
          .from('rejected_claims')
          .select('claim_id');
        const ids = rejectedIds?.map(record => record.claim_id) || [];
        query = query.in('id', ids);
        break;
      }
      case 'today': {
        const { data: todayIds } = await supabase
          .from('todays_claims')
          .select('claim_id');
        const ids = todayIds?.map(record => record.claim_id) || [];
        query = query.in('id', ids);
        break;
      }
      case 'all':
        break;
      default:
        if (['initial_review'].includes(status)) {
          query = query.eq('claim_status', status as ClaimStatus);
        }
    }
  }

  // Apply pagination
  query = query.range(start, end).order('created_at', { ascending: false });

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
