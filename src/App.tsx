import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Import the new component

// Public pages
import Index from "./pages/Index";
import OurStory from "./pages/OurStory";
import Homestay from "./pages/Homestay";
import Room from "./pages/homestay/Room";
import FarmAndGarden from "./pages/FarmAndGarden";
import Trees from "./pages/farm-and-garden/Trees";
import Tree from "./pages/farm-and-garden/Tree";
import Experiences from "./pages/Experiences";
import Journal from "./pages/experiences/Journal";
import Article from "./pages/experiences/Article";
import Connect from "./pages/Connect";

// Auth and Dashboard pages
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard"; // This will be the main dashboard

import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes with the shared website layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="our-story" element={<OurStory />} />
            <Route path="homestay" element={<Homestay />} />
            <Route path="homestay/rooms/:roomSlug" element={<Room />} />
            <Route path="farm-and-garden" element={<FarmAndGarden />} />
            <Route path="farm-and-garden/trees" element={<Trees />} />
            <Route path="farm-and-garden/trees/:treeId" element={<Tree />} />
            <Route path="experiences" element={<Experiences />} />
            <Route path="experiences/journal" element={<Journal />} />
            <Route path="experiences/journal/:articleSlug" element={<Article />} />
            <Route path="connect" element={<Connect />} />
          </Route>

          {/* Auth route without the main layout */}
          <Route path="login" element={<Login />} />

          {/* Protected dashboard route */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;