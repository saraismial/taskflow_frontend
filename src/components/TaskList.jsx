import React from "react";

function TaskList({ loading, error, tasks, sortedTasks }) {
  return (
    <section className="space-y-4">
      {loading && <p className="text-slate-300">Loading tasks...</p>}

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      {!loading && tasks.length === 0 && (
        <p className="text-sm text-slate-400 py-6">No tasks yet.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {sortedTasks.map((task) => (
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
              <span>
                Created by:{" "}
                {task.createdBy?.name || task.createdBy?.email || "Unknown"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TaskList;
