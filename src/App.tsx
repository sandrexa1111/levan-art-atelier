import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VisitListProvider } from "@/context/VisitListContext";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Artworks from "./pages/Artworks";
import ArtworkDetail from "./pages/ArtworkDetail";
import Artist from "./pages/Artist";
import Periods from "./pages/Periods";
import VisitList from "./pages/VisitList";
import PrivateViewing from "./pages/PrivateViewing";
import RoomPreview from "./pages/RoomPreview";
import RoomCompare from "./pages/RoomCompare";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminArtworks from "./pages/admin/AdminArtworks";
import AdminArtworkEditor from "./pages/admin/AdminArtworkEditor";
import AdminViewings from "./pages/admin/AdminViewings";
import AdminTbcRequests from "./pages/admin/AdminTbcRequests";
import AdminPeriods from "./pages/admin/AdminPeriods";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <VisitListProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/artworks" element={<Artworks />} />
                  <Route path="/artworks/:slug" element={<ArtworkDetail />} />
                  <Route path="/periods" element={<Periods />} />
                  <Route path="/artist" element={<Artist />} />
                  <Route path="/private-viewing" element={<PrivateViewing />} />
                  <Route path="/room-preview/:slug" element={<RoomPreview />} />
                  <Route path="/room-compare" element={<RoomCompare />} />
                  <Route path="/visit-list" element={<VisitList />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="artworks" element={<AdminArtworks />} />
                  <Route path="artworks/:id" element={<AdminArtworkEditor />} />
                  <Route path="viewings" element={<AdminViewings />} />
                  <Route path="tbc" element={<AdminTbcRequests />} />
                  <Route path="periods" element={<AdminPeriods />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </VisitListProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
