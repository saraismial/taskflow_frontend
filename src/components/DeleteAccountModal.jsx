import { useState, useEffect } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function DeleteAccountModal({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) setError("");
  }, [isOpen]);

  if (!isOpen) return null;

  const onDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await client.delete("users/me");
      logout();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl rounded-2xl border border-rose-500/30 bg-slate-950/90 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-rose-100">Delete account?</h2>
        <p className="mt-2 text-sm text-slate-300">
          This action cannot be undone.
        </p>

        {error ? (
          <div className="mt-4 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={onDelete}
            disabled={deleting}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-rose-400 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountModal;
