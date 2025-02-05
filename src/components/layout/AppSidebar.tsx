
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  Settings,
  MessageCircle,
  Calendar,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "Claims",
    icon: FileText,
    url: "/claims",
  },
  {
    title: "New Claim",
    icon: FilePlus,
    url: "/claims/new",
  },
  {
    title: "Messages",
    icon: MessageCircle,
    url: "/messages",
  },
  {
    title: "Deadlines",
    icon: Calendar,
    url: "/deadlines",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out successfully",
      });
      navigate("/login");
    }
  };
  
  return (
    <Sidebar className="border-r bg-white">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-blue-600">NextClaim</h1>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-2 rounded-md transition-colors",
                      location.pathname === item.url 
                        ? "bg-blue-50 text-blue-600" 
                        : "hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Sign Out Button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-4 py-2 rounded-md transition-colors text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500">
        Powered by Sails Software
      </div>
    </Sidebar>
  );
}
