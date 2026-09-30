import { useState } from "react";
import { resolveImageUrl } from "../api/client";

function BranchPhotoModal({ branch, onClose }) {
  const gallery = (
    Array.isArray(branch.images) && branch.images.length > 0 ? branch.images : Array(5).fill(branch.image)
  ).map(resolveImageUrl);
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (i) => setActiveIndex((i + gallery.length) % gallery.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <button
            aria-label="بستن"
            onClick={onClose}
            className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="h-[50vh] w-full overflow-hidden rounded-lg2 sm:h-[60vh]">
            <img src={gallery[activeIndex]} alt={branch.name} className="h-full w-full object-cover" />
          </div>

          <button
            aria-label="عکس قبلی"
            onClick={() => goTo(activeIndex - 1)}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            aria-label="عکس بعدی"
            onClick={() => goTo(activeIndex + 1)}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: "scaleX(-1)" }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        <div className="mt-3 flex justify-center gap-2">
          {gallery.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-md2 border-2 transition-colors ${
                i === activeIndex ? "border-primary" : "border-transparent"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BranchPhotoModal;