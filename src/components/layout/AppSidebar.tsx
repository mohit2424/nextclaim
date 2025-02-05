
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Settings,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
  
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    className="flex items-center gap-3"
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
