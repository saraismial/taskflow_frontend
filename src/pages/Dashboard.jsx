import { useEffect, useState, useMemo } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";
import EditTaskModal from "../components/EditTaskModal";
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

  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await client.get("/tasks");

        if (!Array.isArray(res.data)) {
          console.error("Invalid tasks payload:", res.data);
          setTasks([]);
          return;
        }

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

  const handleStartEditTask = (task) => {
    setEditError("");

    if (!task) {
      setEditingTask(null);
      setIsEditModalOpen(false);
      return;
    }

    setEditingTask({
      ...task,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
    setEditError("");
  };

  const handleEditTaskChange = (e) => {
    if (!editingTask) return;
    const { name, value } = e.target;

    setEditingTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editingTask) return;

    if (!editingTask.title.trim()) {
      setEditError("Title is required.");
      return;
    }

    setSavingEdit(true);
    setEditError("");

    try {
      const payload = {
        title: editingTask.title.trim(),
        description: editingTask.description?.trim() || undefined,
        priority: editingTask.priority,
        status: editingTask.status,
        dueDate: editingTask.dueDate || undefined,
      };

      const res = await client.patch(`/tasks/${editingTask._id}`, payload);
      const updated = res.data.task || res.data;

      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );

      setIsEditModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Update task failed:", err);
      setEditError(err.response?.data?.message || "Failed to updated task.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await client.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Delete task failed:", err);
      setError(err.response?.data?.message || "Failed to delete task.");
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
        <TaskForm
          task={newTask}
          creating={creating}
          error={createError}
          onChange={handleNewTaskChange}
          onSubmit={handleCreateTask}
          title="Create a new task"
          description="Add tasks with priority and due dates to keep things moving."
          submitButtonText="Add task"
          submitButtonLoadingText="Creating..."
        />

        <TaskList
          loading={loading}
          error={error}
          tasks={tasks}
          sortedTasks={sortedTasks}
          onEditTask={handleStartEditTask}
          onDeleteTask={handleDeleteTask}
        />

        <EditTaskModal
          isOpen={isEditModalOpen}
          task={editingTask}
          creating={savingEdit}
          error={editError}
          onChange={handleEditTaskChange}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateTask}
        />
      </section>
    </div>
  );
}

export default Dashboard;
