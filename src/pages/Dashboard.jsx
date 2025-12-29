import { useEffect, useState, useMemo } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import NewTaskForm from "../components/NewTaskForm";
import TaskList from "../components/TaskList";

const PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
};

function Dashboard() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
  });

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await client.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

      if (aDue !== bDue) return aDue - bDue;

      const aPriority = PRIORITY_ORDER[a.priority] ?? 99;
      const bPriority = PRIORITY_ORDER[b.priority] ?? 99;

      return aPriority - bPriority;
    });
  }, [tasks]);

  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!newTask.title.trim()) {
      setCreateError("Title is required.");
      return;
    }

    setCreating(true);
    try {
      const payload = {
        title: newTask.title.trim(),
        description: newTask.description.trim() || undefined,
        priority: newTask.priority,
        status: newTask.status,
        dueDate: newTask.dueDate || undefined,
      };

      const res = await client.post("/tasks", payload);

      const createdTask = res.data.task || res.data;
      setTasks((prev) => [createdTask, ...prev]);

      try {
        const all = await client.get("/tasks");
        setTasks(all.data);
      } catch (fetchErr) {
        console.warn("Failed to refetch tasks after create:", fetchErr);
      }

      // reset
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
        dueDate: "",
      });
    } catch (err) {
      console.error("Create task failed:", err);
      setCreateError(err.response?.data?.message || "Failed to create task.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="flex flex-col gap-2 md:ustify-between py-2">
        <div>
          <h1 className="text-2xl font-semibold text-rose-100">
            Task Dashboard
          </h1>
          <p className="text-sm text-slate-300">
            Welcome, {user?.name || user?.email}. View and manage your tasks.
          </p>
        </div>
        <div className="flex-start text-right text-xs text-slate-400 mb-2 ">
          <p>{today}</p>
          <p>{sortedTasks.length} task(s)</p>
        </div>
      </header>

      <section className="space-y-4">
        <NewTaskForm
          newTask={newTask}
          creating={creating}
          createError={createError}
          onChange={handleNewTaskChange}
          onSubmit={handleCreateTask}
        />
        <TaskList
          loading={loading}
          error={error}
          tasks={tasks}
          sortedTasks={sortedTasks}
        />
      </section>
    </div>
  );
}

export default Dashboard;
