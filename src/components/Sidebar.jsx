import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col w-60 border-r border-rose-500/20 bg-slate-950//70 backdrop-blur px-4 py-6">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Overview
        </p>
      </div>

      <nav className="flex flex-col gap-2 text-sm">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 transition ${
              isActive
                ? "bg-rose-500/20 text-rose-100 border border-rose-40"
                : "text-slate-300 hover:bg-slate-900/70 hover:text-rose-100"
            }`
          }
        >
          Dashboard
        </NavLink>
      </nav>

      {user && (
        <nav className="flex flex-col gap-2 text-sm">
          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-rose-500/20 text-rose-100 border border-rose-404"
                  : "text-slate-300 hover:bg-slate-900/70 hover:text-rose-100"
              }`
            }
          >
            Profile
          </NavLink>
        </nav>
      )}
    </aside>
  );
}

export default Sidebar;
