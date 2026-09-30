import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchModal({ onClose }) {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const submit = () => {
    const query = value.trim();
    if (!query) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-24" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-lg2 bg-surface p-5 shadow-md2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center gap-3">
          <button aria-label="بستن" onClick={onClose} className="text-ink-muted hover:text-ink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <h2 className="text-base font-bold text-ink">جستجو</h2>
        </div>

        <p className="mb-3 text-sm text-ink-muted">لطفا متن خود را تایپ و سپس دکمه Enter را بزنید.</p>

        <div className="flex items-center gap-2 rounded-full border border-line px-4 py-2 focus-within:border-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="جستجو"
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
