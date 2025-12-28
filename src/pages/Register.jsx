import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-950/80 p-8 shadow-xl border border-rose-500/25 backdrop-blur">
        <h1 className="mb-2 text-2xl font-semibold text-rose-100">
          Create your account
        </h1>
        <p className="mb-6 text-sm text-slate-300">
          Sign up to start organizing tasks and workflows.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Name</label>
            <input
              name="name"
              type="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-rose-400 focus:outline-none"
            />
          </div>
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
            Sign up
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-rose-300 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
