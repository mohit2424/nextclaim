
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ClaimDetails from "./pages/ClaimDetails";
import NotFound from "./pages/NotFound";
import { ClaimsList } from "./components/claims/ClaimsList";
import NewClaim from "./pages/NewClaim";
import Messages from "./pages/Messages";
import Deadlines from "./pages/Deadlines";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/claims" element={<ClaimsList searchQuery="" />} />
          <Route path="/claims/new" element={<NewClaim />} />
          <Route path="/claims/:id" element={<ClaimDetails />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/deadlines" element={<Deadlines />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
