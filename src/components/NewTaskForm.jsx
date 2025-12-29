import { React } from "react";

function NewTaskForm({ newTask, creating, createError, onChange, onSubmit }) {
  return (
    <section className="rounded-2xl border border-rose-500/30 bg-slate-950/80 p-6 shadow-xl">
      <h2 className="text-sm font-semibold text-rose-100 mb-4">
        Create a new task
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        Add tasks with priority and due dates to keep things moving.
      </p>
      {createError && (
        <div className="mb-3 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {createError}
        </div>
      )}

      <form onSubmit={onSubmit} className="md:col-span-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-slate-300">Title</label>
          <input
            name="title"
            type="text"
            value={newTask.title}
            onChange={onChange}
            className="w-full rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-rose-400 focus:outline-none"
            placeholder="Draft Q1 roadmap, follow up with client..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-slate-300">
            Description
          </label>
          <input
            name="description"
            type="text"
            value={newTask.description}
            onChange={onChange}
            className="w-full rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-rose-400 focus:outline-none"
            placeholder="Add context, links, or notes."
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-slate-300">Priority</label>
          <select
            name="priority"
            value={newTask.priority}
            onChange={onChange}
            className="w-full rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-rose-400 focus:outline-none"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-slate-300">Status</label>
          <select
            name="status"
            value={newTask.status}
            onChange={onChange}
            className="w-full rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-rose-400 focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-progress</option>
            <option value="comppleted">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-slate-300">Due date</label>
          <input
            name="dueDate"
            type="date"
            value={newTask.dueDate}
            onChange={onChange}
            className="w-full rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-rose-400 focus:outline-none"
            placeholder="Add context, links, or notes."
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center justify-center rounded-md bg-rose-500 px-4 py-2 mt-4 text-sm font-medium text-slate-950 hover:bg-rose-400 disabled:opacity-60 disable:cursor-not-allowed transition"
          >
            {creating ? "Creating..." : "Add task"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default NewTaskForm;
