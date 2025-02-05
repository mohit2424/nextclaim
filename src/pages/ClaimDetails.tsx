import { useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Building2, User, Upload, FileText, BriefcaseIcon } from "lucide-react";

export default function ClaimDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  // Mock data for demonstration
  const claimData = {
    id: id,
    status: "Pending",
    claimant: {
      name: "John Doe",
      ssn: "XXX-XX-1234",
      dob: "1990-01-01",
      phone: "(555) 123-4567",
      email: "john.doe@example.com",
      address: "123 Main St, Anytown, CA 12345"
    },
    employer: {
      name: "Tech Corp Inc.",
      ein: "12-3456789",
      contact: "HR Department",
      phone: "(555) 987-6543",
      address: "456 Business Ave, Commerce City, CA 12345"
    },
    unemployment: {
      lastDay: "2024-02-15",
      reason: "Company Layoff",
      severance: "Yes",
      severanceAmount: "$5,000"
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast({
        title: "File selected",
        description: `${selectedFile.name} is ready to upload.`
      });
    }
  };

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
                  <Input value={claimData.claimant.name} readOnly />
                </div>
                <div>
                  <Label>SSN</Label>
                  <Input value={claimData.claimant.ssn} readOnly />
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input value={claimData.claimant.dob} readOnly />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={claimData.claimant.phone} readOnly />
                </div>
                <div className="col-span-2">
                  <Label>Email</Label>
                  <Input value={claimData.claimant.email} readOnly />
                </div>
                <div className="col-span-2">
                  <Label>Address</Label>
                  <Input value={claimData.claimant.address} readOnly />
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
                <div>
                  <Label>Company Name</Label>
                  <Input value={claimData.employer.name} readOnly />
                </div>
                <div>
                  <Label>EIN</Label>
                  <Input value={claimData.employer.ein} readOnly />
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <Input value={claimData.employer.contact} readOnly />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={claimData.employer.phone} readOnly />
                </div>
                <div className="col-span-2">
                  <Label>Address</Label>
                  <Input value={claimData.employer.address} readOnly />
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
                  <Input value={claimData.unemployment.lastDay} readOnly />
                </div>
                <div>
                  <Label>Reason for Unemployment</Label>
                  <Input value={claimData.unemployment.reason} readOnly />
                </div>
                <div>
                  <Label>Severance Package</Label>
                  <Input value={claimData.unemployment.severance} readOnly />
                </div>
                <div>
                  <Label>Severance Amount</Label>
                  <Input value={claimData.unemployment.severanceAmount} readOnly />
                </div>
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
                    />
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, DOC up to 10MB
                  </p>
                </div>
                {file && (
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}