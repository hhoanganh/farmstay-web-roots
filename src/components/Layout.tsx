
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background-primary))]">
      {!isHomepage && <Header />}
      <main className={`flex-1 ${!isHomepage ? 'pt-16' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
