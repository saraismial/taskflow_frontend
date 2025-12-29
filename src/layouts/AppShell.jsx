import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { Outlet } from "react-router-dom";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950 to-slate-950 text-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
