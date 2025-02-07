
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ClaimantInformationTab } from "@/components/claims/ClaimantInformationTab";
import { EmployerDetailsTab } from "@/components/claims/EmployerDetailsTab";
import { UnemploymentDetailsTab } from "@/components/claims/UnemploymentDetailsTab";
import { DocumentsTab } from "@/components/claims/DocumentsTab";
import { toast } from "sonner";

export type ClaimDocument = {
  name: string;
  path: string;
  type: string;
  size: number;
};

export type Claim = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  age: number;
  state: string;
  pincode: string;
  ssn: string;
  email: string;
  phone: string;
  employer_name: string;
  claim_date: string;
  claim_status: string;
  separation_reason: string;
  documents: ClaimDocument[];
  last_day_of_work: string | null;
  severance_package: boolean | null;
  severance_amount: number | null;
  reason_for_unemployment: string | null;
  employment_start_date: string | null;
  employment_end_date: string | null;
};

export default function ClaimDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: claim, isLoading, error } = useQuery({
    queryKey: ['claim', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('No claim ID provided');
      }

      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Claim not found');
      
      const transformedDocuments = Array.isArray(data.documents) 
        ? data.documents.map((doc: any) => ({
            name: doc.name || '',
            path: doc.path || '',
            type: doc.type || '',
            size: doc.size || 0
          }))
        : [];
      
      const transformedData: Claim = {
        ...data,
        documents: transformedDocuments
      };
      
      return transformedData;
    },
    enabled: !!id,
  });

  const handleEditClick = () => {
    // Navigate to edit page
    navigate(`/claims/${id}/edit`);
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Claim</h2>
          <p className="text-muted-foreground mt-2">{error.message}</p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/dashboard')}
          >
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[500px]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!claim) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Claim not found</h2>
          <p className="text-muted-foreground">The requested claim could not be found.</p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/dashboard')}
          >
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Claim Details</h1>
            <p className="text-muted-foreground">Claim ID: {id}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Print Claim</Button>
            <Button onClick={handleEditClick}>Edit Claim</Button>
          </div>
        </div>

        <Tabs defaultValue="claimant">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="claimant">Claimant Information</TabsTrigger>
            <TabsTrigger value="employer">Employer Details</TabsTrigger>
            <TabsTrigger value="unemployment">Unemployment Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="claimant">
            <ClaimantInformationTab claim={claim} />
          </TabsContent>

          <TabsContent value="employer">
            <EmployerDetailsTab claim={claim} />
          </TabsContent>

          <TabsContent value="unemployment">
            <UnemploymentDetailsTab claim={claim} />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab claim={claim} claimId={id!} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
