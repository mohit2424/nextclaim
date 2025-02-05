
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Settings,
  BarChart3,
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
    title: "Analytics",
    icon: BarChart3,
    url: "#analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#settings",
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <Sidebar className="border-r bg-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 transition-colors",
                      location.pathname === item.url && "bg-primary/10 text-primary"
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
