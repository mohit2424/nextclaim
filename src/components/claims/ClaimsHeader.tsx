
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ClaimsHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 
          className="text-2xl font-semibold text-blue-600 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          Claims List
        </h1>
      </div>
      <h2 className="text-xl font-bold text-blue-600">
        NEXTCLAIM
      </h2>
    </div>
  );
}
