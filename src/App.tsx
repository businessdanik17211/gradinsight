import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Applicants from "./pages/Applicants";
import Students from "./pages/Students";
import Statistics from "./pages/Statistics";
import UniversityDetail from "./pages/UniversityDetail";
import Admin from "./pages/Admin";
import AdmissionStats from "./pages/AdmissionStats";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AIChat } from "@/components/AIChat";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const AppContent = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const showChat = ['/applicants', '/students', '/', '/statistics', '/admission-stats'].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Index isChatOpen={isChatOpen} onChatToggle={setIsChatOpen} />} />
        <Route path="/applicants" element={<Applicants isChatOpen={isChatOpen} onChatToggle={setIsChatOpen} />} />
        <Route path="/students" element={<Students isChatOpen={isChatOpen} onChatToggle={setIsChatOpen} />} />
        <Route path="/statistics" element={<Statistics isChatOpen={isChatOpen} onChatToggle={setIsChatOpen} />} />
        <Route path="/university/:shortName" element={<UniversityDetail />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/admission-stats" element={<AdmissionStats isChatOpen={isChatOpen} onChatToggle={setIsChatOpen} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AnimatePresence>
        {showChat && <AIChat isOpen={isChatOpen} onToggle={setIsChatOpen} />}
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
