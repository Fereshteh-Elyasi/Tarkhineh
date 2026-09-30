import { useState } from "react";
import StarRating from "./StarRating";
import ProductModal from "./ProductModal";
import { useCart } from "../context/CartContext";
import { toPersianDigits } from "../utils/format";
import { resolveImageUrl } from "../api/client";

function MenuItemCard({ item, wished, onToggleWish }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { addItem } = useCart();

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="flex cursor-pointer overflow-hidden rounded-md2 border border-line bg-surface transition-shadow hover:shadow-md2"
      >
        <div className="h-auto w-[140px] shrink-0">
          <img src={resolveImageUrl(item.image)} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-ink">{item.title}</h3>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWish();
              }}
              aria-label="افزودن به علاقه‌مندی‌ها"
              className={`shrink-0 ${wished ? "text-red-500" : "text-ink-muted hover:text-red-500"}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
            </button>
          </div>

          {item.discountPercent > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-500">٪{toPersianDigits(item.discountPercent)}</span>
              <span className="text-xs text-ink-muted line-through">{item.oldPrice}</span>
            </div>
          )}

          <p className="line-clamp-2 text-xs leading-6 text-ink-muted">{item.description}</p>

          <span className="text-sm font-bold text-ink">{item.price} تومان</span>

          <div className="flex items-center gap-2.5">
            <StarRating rating={item.rating} />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addItem(item);
              }}
              className="flex-1 rounded-full bg-primary py-2 text-xs font-bold text-white transition-colors hover:bg-primary-dark"
            >
              افزودن به سبد خرید
            </button>
          </div>
        </div>
      </div>

      {modalOpen && <ProductModal item={item} onClose={() => setModalOpen(false)} />}
    </>
  );
}

export default MenuItemCard;