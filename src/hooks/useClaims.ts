
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ClaimStatus } from "@/components/claims/ClaimsTable";

interface FetchClaimsParams {
  searchQuery?: string;
  status?: string;
  page: number;
  pageSize: number;
}

export const useClaims = ({ searchQuery, status, page, pageSize }: FetchClaimsParams) => {
  const fetchClaims = async () => {
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
          query = query.in('claim_status', ['initial_review', 'in_progress']);
          break;
        case 'today':
          query = query.gte('created_at', today.toISOString());
          break;
        case 'all':
          break;
        default:
          if (['initial_review', 'in_progress', 'rejected'].includes(status)) {
            query = query.eq('claim_status', status as ClaimStatus);
          }
      }
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, count };
  };

  return useQuery({
    queryKey: ['claims', searchQuery, status, page],
    queryFn: fetchClaims,
  });
};
