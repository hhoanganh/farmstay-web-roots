// ABOUTME: This file defines the main layout structure for the application.
// ABOUTME: It includes the header, main content area (Outlet), and footer.
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {


  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background-primary))]">
      <ScrollToTop />
      <Header />
      {/* pt-20 provides top padding to prevent content from being obscured by the fixed Header */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
