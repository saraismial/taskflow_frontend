import { useState, useEffect } from "react";
import client from "../api/client";

function ChangePasswordModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.currentPassword || !form.newPassword) {
      return setError("Please fill out all fields.");
    }
    if (form.newPassword.length < 6) {
      return setError("New password must be at least 6 characters.");
    }
    if (form.newPassword !== form.confirmNewPassword) {
      return setError("New passwords must match.");
    }

    setSaving(true);
    try {
      await client.patch("/users/me/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setSuccess("Password updated.");

      setTimeout(() => {
        onClose();
      }, 800);

      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl rounded-2xl border border-rose-500/30 bg-slate-950/90 p-6 shadow-2xl">
        <header className="mb-4">
          <h2 className="text-xl font-semibold text-rose-100">
            Change password
          </h2>
          <p className="mt-1 text-sm text-slate-200">
            Enter your current password and your new password.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          {error ? (
            <div className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {success}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="block text-sm text-slate-300">
              Current password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 outline-none focus:border-rose-400"
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-300">New password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 outline-none focus:border-rose-400"
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-300">
              Confirm new password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              value={form.confirmNewPassword}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 outline-none focus:border-rose-400"
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
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
              {saving ? "Saving..." : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
