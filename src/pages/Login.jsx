import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, sessionExpired, clearSessionExpired } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <nav className="w-full bg-slate-950/70 border-b border-rose-500/30 px-8 py-5 flex items-center justify-between backdrop-blur">
        <Link
          to="/"
          className=" text-xl font-semibold text-rose-300 tracking-tight"
        >
          TaskFlow
        </Link>
      </nav>
      <div className="flex flex-col min-h-[calc(100vh-146px)] items-center justify-center px-4 box-border">
        {sessionExpired && (
          <div className="my-10 rounded-md border border-amber-400/60 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 flex justify-between items-center gap-2">
            <span>Your session expired. Please log in again.</span>
            <button
              type="button"
              onClick={clearSessionExpired}
              className="text-[11px] underline decoration-amber-300/70 hover:decoration-amber-100"
            >
              Dismiss
            </button>
          </div>
        )}
        <div className="w-full max-w-md rounded-2xl bg-slate-950/80 p-8 shadow-xl border border-rose-500/25 backdrop-blur">
          <h1 className="mb-2 text-2xl font-semibold text-rose-100">
            Welcome back
          </h1>
          <p className="mb-6 text-sm text-slate-300">
            Log in to manage tasks and workflows
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-rose-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-slate-950 focus:border-rose-400 transition shadow-sm"
            >
              Log in
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-rose-300 hover:underline">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
