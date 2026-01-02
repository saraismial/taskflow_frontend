import { useState } from "react";

export default function TaskList({
  loading,
  error,
  tasks,
  sortedTasks,
  onEditTask,
  onDeleteTask,
}) {
  const [activeTaskId, setActiveTaskId] = useState(null);

  const handleCardClick = (taskId) => {
    setActiveTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const handleEditClick = (task, e) => {
    // Prevent re-toggle whne clicking
    e.stopPropagation();
    if (onEditTask) onEditTask(task);
  };

  const handleDeleteClick = (taskId, e) => {
    // Prevent re-toggle whne clicking
    e.stopPropagation();
    if (onDeleteTask) onDeleteTask(taskId);
  };

  return (
    <section className="space-y-4">
      {loading && <p className="text-slate-300">Loading tasks...</p>}

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      {!loading && tasks.length === 0 && (
        <p className="text-sm text-slate-400 py-6">No tasks yet.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {sortedTasks.map((task) => {
          const isActive = activeTaskId === task._id;

          return (
            <div
              key={task._id}
              className="rounded-xl border border-rose-500/25 bg-slate-950/70 p-4 shadow-lg"
              onClick={() => handleCardClick(task._id)}
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
                <p className="mt-2 text-sm text-slate-200">
                  {task.description}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>Priority: {task.priority}</span>

                {task.dueDate && (
                  <span>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                <span>
                  Created by:{" "}
                  {task.createdBy?.name || task.createdBy?.email || "Unknown"}
                </span>
              </div>

              {isActive && (
                <div className="mt-4 flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={(e) => handleEditClick(task, e)}
                    className="rounded-md border border-slate-700 px-3 py-1 font-medium text-slate-200 hover:bg-slate-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(task._id, e)}
                    className="rounded-md border border-slate-700 px-3 py-1 font-medium text-slate-200 hover:bg-slate-800"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
