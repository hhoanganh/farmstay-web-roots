
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

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

// Auth and Admin pages
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBookings from "./pages/admin/Bookings";
import AdminTrees from "./pages/admin/Trees";
import AdminPages from "./pages/admin/content/Pages";
import AdminJournal from "./pages/admin/content/Journal";
import AdminStaff from "./pages/admin/settings/Staff";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with shared layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="our-story" element={<OurStory />} />
            <Route path="homestay" element={<Homestay />} />
            <Route path="homestay/rooms/:roomName" element={<Room />} />
            <Route path="farm-and-garden" element={<FarmAndGarden />} />
            <Route path="farm-and-garden/trees" element={<Trees />} />
            <Route path="farm-and-garden/trees/:treeId" element={<Tree />} />
            <Route path="experiences" element={<Experiences />} />
            <Route path="experiences/journal" element={<Journal />} />
            <Route path="experiences/journal/:articleName" element={<Article />} />
            <Route path="connect" element={<Connect />} />
          </Route>

          {/* Auth routes without layout */}
          <Route path="login" element={<Login />} />

          {/* Admin routes (protected) - NO Layout wrapper */}
          {/* Routes accessible to both admin and staff */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'staff']} />}>
            {/* Admin dashboard uses its own layout */}
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/bookings" element={<AdminBookings />} />
            <Route path="admin/trees" element={<AdminTrees />} />
          </Route>

          {/* Routes accessible only to admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin/content/pages" element={<AdminPages />} />
            <Route path="admin/content/journal" element={<AdminJournal />} />
            <Route path="admin/settings/staff" element={<AdminStaff />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
