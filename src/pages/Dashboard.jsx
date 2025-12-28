import { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await client.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-rose-100">
            Task Dashboard
          </h1>
          <p className="text-sm text-slate-300">
            Welcome, {user?.name || user?.email}. View and manage your tasks.
          </p>
        </div>
      </div>

      {loading && <p className="text-slate-300">Loading tasks...</p>}

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      {!loading && tasks.length === 0 && (
        <p className="text-sm text-slate-400">
          No tasks yet. Use future UI form to create some.
        </p>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="rounded-xl border border-rose-500/25 bg-slate-950/70 p-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-100">
                {task.title}
              </h2>
              <span className="rounded-full bg-rose-950/70 px-4 py-0.5 text-xs uppercase tracking-wide text-rose-200 border border-rose-500/40">
                {task.status}
              </span>
            </div>

            {task.description && (
              <p className="mt-2 text-sm text-slate-200">{task.description}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>Priority: {task.priority}</span>

              {task.dueDate && (
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              )}

              <span>Created by: {task.createdBy?.email || "Unknown"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
