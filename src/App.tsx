
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import NotificacionesOposicion from "./pages/NotificacionesOposicion";
import NotFound from "./pages/NotFound";
import IniciaSesion from "./pages/IniciaSesion";
import Dashboard from "./pages/Dashboard";
import NuevoTest from "./pages/NuevoTest";
import ChatJuridico from "./pages/ChatJuridico";
import MisApuntes from "./pages/MisApuntes";
import DetalleApunte from "./pages/DetalleApunte";
import MisRecursos from "./pages/MisRecursos";
import MisNotificaciones from "./pages/MisNotificaciones";
import Ajustes from "./pages/Ajustes";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/notificaciones-oposicion" element={<NotificacionesOposicion />} />
              <Route path="/inicia-sesion" element={<IniciaSesion />} />
              <Route 
                path="/dashboard/*" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              >
                <Route path="nuevo-test" element={<NuevoTest />} />
                <Route path="chat-juridico" element={<ChatJuridico />} />
                <Route path="mis-apuntes" element={<MisApuntes />} />
                <Route path="mis-apuntes/:id" element={<DetalleApunte />} />
                <Route path="mis-recursos" element={<MisRecursos />} />
                <Route path="mis-notificaciones" element={<MisNotificaciones />} />
                <Route path="ajustes" element={<Ajustes />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
