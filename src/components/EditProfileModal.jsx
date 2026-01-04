import { useState, useEffect } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

function EditProfileModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && user) {
      setForm({ name: user.name || "", email: user.email || "" });
      setError("");
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Name is required");
    // SHOULD EMAIL BE RQUIRED? MAYBE NOT come back to later
    if (!form.email.trim()) return setError("Email is required");

    setSaving(true);
    try {
      const res = await client.patch("/users/me", {
        name: form.name.trim(),
        email: form.email.trim(),
      });

      const updated = res.data.user || res.data;

      updateUser((prev) => ({ ...prev, ...updated }));

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl rounded-2xl border border-rose-500/30 bg-slate-950/90 p-6 shadow-2xl">
        <header className="mb-4">
          <h2 className="text-xl font-semibold text-rose-100">Edit profile</h2>
          <p className="mt-1 text-sm text-slate-200">
            Update your name or email
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          {error ? (
            <div className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="block text-sm text-slate-300">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 outline-none focus:border-rose-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 outline-none focus:border-rose-400"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-rose-400 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Update profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
