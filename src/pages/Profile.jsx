import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const handleDeleteAccount = async () => {
    try {
      await client.delete("/users/me");
      logout();
      navigate("/login");
    } catch (err) {
      setError("Failed to delete account.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-rose-100">Profile</h1>
        <p className="text-sm text-slate-300 mt-1">
          Basic account details for your TaskFlow workspace.
        </p>

        <div className="flex gap-2 mt-10">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="rounded-lg bg-slate-900/60 px-4 py-2 text-sm font-semibold text-rose-100 ring-1 ring-rose-500/30 hover:bg-slate-900"
          >
            Edit profile
          </button>
          <button
            type="button"
            onClick={() => setIsPasswordOpen(true)}
            className="rounded-lg bg-slate-900/60 px-4 py-2 text-sm font-semibold text-rose-100 ring-1 ring-rose-500/30 hover:bg-slate-900"
          >
            Change password
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-rose-500/30 bg-slate-950/70 p-6 shadow-xl">
        <dl className="space-y-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Name</dt>
            <dd className="text-slate-100">{user.name || ""}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400 break-all">Email</dt>
            <dd className="text-slate-100">{user.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-400">Role</dt>
            <dd className="capitalize text-rose-200">{user.role}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-rose-500/30 bg-slate-950/70 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-red-100">Danger zone</h2>
        <p className="mt-1 text-sm text-slate-300">
          Permanently delete your account.
        </p>

        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className="mt-4 rounded-lg bg-rose-900/60 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-rose-500"
        >
          Delete account
        </button>
      </section>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
      <ChangePasswordModal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete account?"
        desc="This will permanently delete your account."
        confirmTxt="Delete account"
        onConfirm={handleDeleteAccount}
        error={error}
      />
    </div>
  );
}
