import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBranches } from "../api/branchesApi";
import { resolveImageUrl } from "../api/client";

function BranchModal({ onClose }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    fetchBranches().then((data) => {
      if (alive) {
        setBranches(data);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const handleSelect = (branch) => {
    onClose();
    navigate(`/branch/${branch.slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-lg2 bg-surface p-6 shadow-md2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">انتخاب شعبه</h2>
          <button aria-label="بستن" onClick={onClose} className="text-ink-muted hover:text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <p className="mb-5 text-sm text-ink-muted">
          برای دیدن منوی رستوران، لطفا شعبه مدنظر خود را انتخاب کنید:
        </p>

        {loading ? (
          <p className="py-8 text-center text-sm text-ink-muted">در حال بارگذاری شعبه‌ها...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {branches.map((b) => (
              <div
                key={b.slug}
                onClick={() => handleSelect(b)}
                className="cursor-pointer overflow-hidden rounded-md2 border border-line transition-shadow hover:shadow-md2"
              >
                <div className="h-28 w-full">
                  <img src={resolveImageUrl(b.image)} alt={b.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="mb-1 text-sm font-bold text-ink">{b.name}</h3>
                  <p className="text-xs text-ink-muted">{b.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BranchModal;