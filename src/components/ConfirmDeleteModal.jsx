export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete?",
  desc = "This action cannot be undone.",
  confirmTxt = "Delete",
  error = "",
  isDeleting = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl rounded-2xl border border-rose-500/30 bg-slate-950/90 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-rose-100">{title}</h2>
        <p className="mt-2 text-sm text-slate-300"> {desc}</p>

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
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-rose-400 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : confirmTxt}
          </button>
        </div>
      </div>
    </div>
  );
}
