
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClaimHeaderProps {
  id: string;
  isEditing: boolean;
  onEditClick: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}

export function ClaimHeader({ id, isEditing, onEditClick, onCancelEdit, onSaveEdit }: ClaimHeaderProps) {
  const navigate = useNavigate();

  return (
    <>
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
          {isEditing ? (
            <>
              <Button variant="outline" onClick={onCancelEdit}>Cancel</Button>
              <Button onClick={onSaveEdit}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={onEditClick}>Edit Claim</Button>
          )}
        </div>
      </div>
    </>
  );
}
