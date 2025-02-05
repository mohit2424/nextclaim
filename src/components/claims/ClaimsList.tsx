
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash/debounce";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Claim = {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  claim_status: string;
  employer_name: string;
  claim_date: string;
  ssn: string;
};

interface ClaimsListProps {
  searchQuery: string;
}

const fetchClaims = async (searchQuery: string = "") => {
  let query = supabase
    .from('claims')
    .select('*')
    .order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.or(`id.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,ssn.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

const getStatusColor = (status: string) => {
  const colors = {
    initial_review: "bg-yellow-100 text-yellow-800 border-yellow-200",
    pending: "bg-blue-100 text-blue-800 border-blue-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
};

export function ClaimsList({ searchQuery }: ClaimsListProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: claims = [], isLoading, refetch } = useQuery({
    queryKey: ['claims', searchQuery],
    queryFn: () => fetchClaims(searchQuery),
  });

  const totalPages = Math.ceil(claims.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClaims = claims.slice(startIndex, startIndex + itemsPerPage);

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

  if (isLoading) {
    return <div className="p-8 text-center">Loading claims...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Claim ID</TableHead>
              <TableHead className="font-semibold">Claimant Name</TableHead>
              <TableHead className="font-semibold">Date Submitted</TableHead>
              <TableHead className="font-semibold">Last Updated</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Employer</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="font-semibold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClaims.map((claim) => (
              <TableRow key={claim.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{claim.id}</TableCell>
                <TableCell>{`${claim.first_name} ${claim.last_name}`}</TableCell>
                <TableCell>{new Date(claim.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(claim.updated_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge 
                    className={`${getStatusColor(claim.claim_status)} border`}
                    variant="secondary"
                  >
                    {claim.claim_status.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                </TableCell>
                <TableCell>{claim.employer_name}</TableCell>
                <TableCell>{new Date(claim.claim_date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/claims/${claim.id}`)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
