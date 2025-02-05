
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Settings,
  Gavel,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
    title: "Appellate Information",
    icon: Gavel,
    url: "/appellate",
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
