import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import RoleSelector from "./pages/RoleSelector";
import AmbulanceDashboard from "./pages/AmbulanceDashboard";
import TemporaryEmergencyDashboard from "./pages/TemporaryEmergencyDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RoleSelector />} />
            <Route path="/ambulance" element={<AmbulanceDashboard />} />
            <Route path="/temporary" element={<TemporaryEmergencyDashboard />} />
            <Route path="/police" element={<PoliceDashboard />} />
            <Route path="/hospital" element={<HospitalDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
