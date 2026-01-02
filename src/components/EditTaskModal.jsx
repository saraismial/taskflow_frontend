import TaskForm from "./TaskForm";

export default function EditTaskModal({
  isOpen,
  task,
  creating,
  error,
  onChange,
  onSubmit,
  onClose,
}) {
  if (!isOpen || !task) return null;

  const cancelEditEl = (
    <button
      type="button"
      onClick={onClose}
      className="inline-flex items-center mr-auto justify-center rounded-md bg-slate-500 px-4 py-2 mt-4 text-xs font-medium text-slate-950 hover:bg-slate-400 disabled:opacity-60 disable:cursor-not-allowed transition"
    >
      Cancel
    </button>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg">
        <TaskForm
          task={task}
          creating={creating}
          error={error}
          onChange={onChange}
          onSubmit={onSubmit}
          title="Edit task"
          description="Update your task details."
          submitButtonText="Update task"
          submitButtonLoadingText="Saving..."
          secondaryAct={cancelEditEl}
        />
      </div>
    </div>
  );
}
