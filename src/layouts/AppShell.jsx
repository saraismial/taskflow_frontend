import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.jsx";

export default function AppShell() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-rose-950 to-slate-950 text-slate-50 overflow-hidden">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="min-h-screen flex-1 px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
