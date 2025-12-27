import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-slate-900/80 border-slate-700 px-6 py-3 flex items-center justify-between backdrop-blur">
      <Link to="/" className="text-lg font-semibold text-indigo-300">
        TaskFlow
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {user && (
          <span className="text-slate-300">
            {user.email}
            {""}
            <span className="ml-1 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
              {user.role}
            </span>
          </span>
        )}
        {user ? (
          <button
            onClick={logout}
            className="rounded-md bg-slate-800 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-700"
          >
            Log out
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-md px-3 text-xs font-medium text-slate-200 hover:bg-slate-800"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-indigo-500 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-400"
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
