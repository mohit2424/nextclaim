
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
        <div className="text-center text-sm text-gray-500 p-4 border-t">
          
        </div>
      </div>
    </div>
  );
}
