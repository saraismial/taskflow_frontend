import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-rose-100">Profile</h1>
        <p className="text-sm text-slate-300 mt-1">
          Basic account details for your TaskFlow workspace.
        </p>
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
    </div>
  );
}
