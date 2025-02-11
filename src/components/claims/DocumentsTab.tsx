
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Claim } from "@/pages/ClaimDetails";
import { useState } from "react";

interface DocumentsTabProps {
  claim: Claim;
  claimId: string;
}

export function DocumentsTab({ claim, claimId }: DocumentsTabProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      const filePath = `${claimId}/${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('claim_documents')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const newDocument = {
        name: selectedFile.name,
        path: filePath,
        type: selectedFile.type,
        size: selectedFile.size
      };

      const { error: updateError } = await supabase
        .from('claims')
        .update({
          documents: [...(claim.documents || []), newDocument]
        })
        .eq('id', claimId);

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

  return (
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
            {claim.documents.map((doc, index) => (
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
  );
}
