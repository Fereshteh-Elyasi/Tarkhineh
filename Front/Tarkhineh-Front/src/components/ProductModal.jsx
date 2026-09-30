import { useState } from "react";
import StarRating from "./StarRating";
import { toPersianDigits } from "../utils/format";
import { resolveImageUrl } from "../api/client";

function ProductModal({ item, onClose }) {
  const gallery = (
    Array.isArray(item.images) && item.images.length > 0 ? item.images : Array(5).fill(item.image)
  ).map(resolveImageUrl);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-lg2 bg-surface shadow-md2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line p-4">
          <h2 className="text-sm font-bold text-ink">اطلاعات محصول</h2>
          <button aria-label="بستن" onClick={onClose} className="text-ink-muted hover:text-ink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="h-">
          <div className=" w-full h-full rounded-lg2 sm:h-64">
            <img src={gallery[activeIndex]} alt={item.title} className="h-full w-full object-cover" />
          </div>
          <div className="flex justify-center gap-3">
            {gallery.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`h-10 w-10 shrink-0 overflow-hidden rounded-md1 border-2 transition-colors
                   ${ i === activeIndex ? "border-s-violet-50" : "border-transparent"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 p-4">
          <div className="text-right">
            <h3 className="text-sm font-bold text-ink">{item.title}</h3>
            <p className="mt-1 text-xs leading-6 text-ink-muted">{item.description}</p>
          </div>
          <div className="shrink-0 text-left">
            <StarRating rating={item.rating} />
            {typeof item.ratingCount === "number" && (
              <p className="mt-1 text-xs text-ink-muted">({toPersianDigits(item.ratingCount)} نظر)</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;