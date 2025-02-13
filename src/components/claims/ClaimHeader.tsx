
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pen, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClaimHeaderProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ClaimHeader({ isEditing, onEdit, onSave, onCancel }: ClaimHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/claims')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Claim Details</h1>
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={onCancel}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={onSave}>
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </>
        ) : (
          <Button onClick={onEdit}>
            <Pen className="h-4 w-4 mr-2" />
            Edit Claim
          </Button>
        )}
      </div>
    </div>
  );
}
