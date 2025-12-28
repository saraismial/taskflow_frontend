import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-slate-950/70 border-b border-rose-500/30 px-8 py-5 flex items-center justify-between backdrop-blur">
      <Link
        to="/"
        className=" text-xl font-semibold text-rose-300 tracking-tight"
      >
        TaskFlow
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {user && (
          <span className="text-slate-200">
            {user.name || user.email}
            {""}
            <span className="ml-2 rounded-full bg-rose-950/70 px-2 py-0.5 text-xs text-rose-200 border-rose/30">
              {user.role}
            </span>
          </span>
        )}
        {user ? (
          <button
            onClick={logout}
            className="rounded-md bg-rose-500/90 px-3 py-1 text-xs font-medium text-slate-950 hover:bg-rose-400 transition"
          >
            Log out
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-md px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-900/70 transition"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-rose-500 px-3 py-1 text-xs font-medium text-slate-950 hover:bg-rose-400 transition shadow-sm"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
