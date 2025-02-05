import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ChevronDown, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

type ClaimStatus = "initial_review" | "pending" | "approved" | "rejected";

type Claim = {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  claim_status: ClaimStatus;
  employer_name: string;
  claim_date: string;
  ssn: string;
  weekly_benefit?: number;
};

interface ClaimsListProps {
  searchQuery: string;
}

const fetchClaims = async (searchQuery: string = "", status?: ClaimStatus | "all") => {
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
    query = query.eq('claim_status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

const getStatusColor = (status: ClaimStatus) => {
  const colors = {
    initial_review: "bg-yellow-100 text-yellow-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const formatCurrency = (amount: number = 0) => {
  return `$${amount.toFixed(0)}`;
};

export function ClaimsList({ searchQuery: initialSearchQuery }: ClaimsListProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearchQuery, setLocalSearchQuery] = useState(initialSearchQuery);
  const statusParam = searchParams.get('status') || 'all';
  const status = statusParam === 'all' ? 'all' : statusParam as ClaimStatus;
  const itemsPerPage = 10;

  const { data: claims = [], isLoading, refetch } = useQuery({
    queryKey: ['claims', localSearchQuery, status],
    queryFn: () => fetchClaims(localSearchQuery, status),
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
      <DashboardLayout>
        <div className="p-8 text-center">Loading claims...</div>
      </DashboardLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-blue-600">Claims List</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search claims..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Claims" />
              <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Claims</SelectItem>
              <SelectItem value="initial_review">Initial Review</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold">Claim ID</TableHead>
              <TableHead className="font-semibold">Claimant Name</TableHead>
              <TableHead className="font-semibold">Date Submitted</TableHead>
              <TableHead className="font-semibold">Last Updated</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Weekly Benefit</TableHead>
              <TableHead className="font-semibold">Employer</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="font-semibold w-[100px]">Action</TableHead>
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
                    className={`${getStatusColor(claim.claim_status)}`}
                    variant="secondary"
                  >
                    {claim.claim_status.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(claim.weekly_benefit)}</TableCell>
                <TableCell>{claim.employer_name}</TableCell>
                <TableCell>{new Date(claim.claim_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/claims/${claim.id}`)}
                    className="w-full"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-8">
        Powered by Sails Software
      </div>
    </div>
  );
}
