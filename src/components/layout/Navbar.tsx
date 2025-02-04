import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft, Bell, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== "/";

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-4 gap-4">
        <SidebarTrigger />
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div 
          className="text-xl font-bold text-primary cursor-pointer"
          onClick={() => navigate("/")}
        >
          NEXTCLAIM
        </div>
        <div className="flex-1">
          <form className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full bg-gray-50 pl-8 pr-4 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </form>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full">
          <div className="w-8 h-8 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}