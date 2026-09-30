// مودال تایید عمومی (مثلاً برای تایید حذف). قابل استفاده مجدد در هر جای دیگه پروژه.
function ConfirmModal({ title, message, confirmLabel = "حذف", cancelLabel = "بازگشت", onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <div
        className="w-full max-w-sm rounded-lg2 bg-surface p-5 shadow-md2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center gap-3">
          <button aria-label="بستن" onClick={onCancel} className="text-ink-muted hover:text-ink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <h2 className="text-sm font-bold text-ink">{title}</h2>
        </div>

        <p className="mb-5 text-sm text-ink-muted">{message}</p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-line py-2.5 text-sm font-bold text-ink transition-colors hover:bg-surface-soft"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-red-50 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-100"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
