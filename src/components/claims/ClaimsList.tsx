
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type Claim = {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  claim_status: string;
  employer_name: string;
  claim_date: string;
};

const fetchClaims = async () => {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .order('created_at', { ascending: false });

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

export function ClaimsList() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<Claim[]>([]);

  const { data: initialClaims, isLoading } = useQuery({
    queryKey: ['claims'],
    queryFn: fetchClaims,
  });

  useEffect(() => {
    if (initialClaims) {
      setClaims(initialClaims);
    }
  }, [initialClaims]);

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
        (payload) => {
          console.log('Real-time update received:', payload);
          // Fetch the latest data when changes occur
          fetchClaims().then(newClaims => {
            if (newClaims) {
              setClaims(newClaims);
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return <div className="p-4 text-center">Loading claims...</div>;
  }

  return (
    <div className="overflow-auto">
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
          {claims.map((claim) => (
            <TableRow key={claim.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{claim.id.slice(0, 8)}</TableCell>
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
  );
}
