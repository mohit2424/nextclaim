
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Building2, User, Upload, FileText, BriefcaseIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type ClaimDocument = {
  name: string;
  path: string;
  type: string;
  size: number;
};

export default function ClaimDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  const { data: claim, isLoading } = useQuery({
    queryKey: ['claim', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      const filePath = `${id}/${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('claim_documents')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Update the claim's documents array
      const { error: updateError } = await supabase
        .from('claims')
        .update({
          documents: [...(claim?.documents || []), {
            name: selectedFile.name,
            path: filePath,
            type: selectedFile.type,
            size: selectedFile.size
          }]
        })
        .eq('id', id);

      if (updateError) throw updateError;

      toast({
        title: "File uploaded successfully",
        description: `${selectedFile.name} has been uploaded.`
      });

      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive"
      });
    }
  };

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
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Claim Details</h1>
            <p className="text-muted-foreground">Claim ID: {id}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Print Claim</Button>
            <Button>Update Status</Button>
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
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Claimant Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={`${claim.first_name} ${claim.middle_name || ''} ${claim.last_name}`} readOnly />
                </div>
                <div>
                  <Label>SSN</Label>
                  <Input value={claim.ssn} readOnly />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input value={claim.age} readOnly />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={claim.phone} readOnly />
                </div>
                <div className="col-span-2">
                  <Label>Email</Label>
                  <Input value={claim.email} readOnly />
                </div>
                <div className="col-span-2">
                  <Label>Address</Label>
                  <Input value={`${claim.state}, ${claim.pincode}`} readOnly />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="employer">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Employer Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Company Name</Label>
                  <Input value={claim.employer_name} readOnly />
                </div>
                <div>
                  <Label>Separation Reason</Label>
                  <Input value={claim.separation_reason} readOnly />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="unemployment">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BriefcaseIcon className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Unemployment Details</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Last Day of Work</Label>
                  <Input value={claim.last_day_of_work ? new Date(claim.last_day_of_work).toLocaleDateString() : 'Not specified'} readOnly />
                </div>
                <div>
                  <Label>Reason for Unemployment</Label>
                  <Input value={claim.reason_for_unemployment || 'Not specified'} readOnly />
                </div>
                <div>
                  <Label>Severance Package</Label>
                  <Input value={claim.severance_package ? 'Yes' : 'No'} readOnly />
                </div>
                {claim.severance_package && (
                  <div>
                    <Label>Severance Amount</Label>
                    <Input value={`$${claim.severance_amount?.toFixed(2) || '0.00'}`} readOnly />
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Documents</h2>
              </div>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-primary font-medium">Upload a file</span>
                    <span className="text-muted-foreground"> or drag and drop</span>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, DOC, DOCX, JPG, JPEG, PNG up to 10MB
                  </p>
                </div>
                {claim.documents && claim.documents.length > 0 ? (
                  <div className="space-y-2">
                    {(claim.documents as ClaimDocument[]).map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{doc.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            window.open(
                              supabase.storage
                                .from('claim_documents')
                                .getPublicUrl(doc.path).data.publicUrl,
                              '_blank'
                            );
                          }}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No documents uploaded yet.</p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
