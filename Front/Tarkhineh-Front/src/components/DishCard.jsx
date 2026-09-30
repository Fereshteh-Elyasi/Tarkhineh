import StarRating from "./StarRating";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../api/client";

function DishCard({ item, fixedWidth = true }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      id: item.id,
      title: item.name,
      image: item.image,
      price: item.price,
      oldPrice: item.oldPrice,
      discountPercent: item.discountPercent,
      rating: item.rating,
      description: item.description ?? "",
    });
  };

  return (
    <div
      className={`shrink-0 rounded-lg2 border border-line bg-surface overflow-hidden ${
        fixedWidth ? "w-[220px]" : "w-full"
      }`}
    >
      <div className="h-[140px]">
        <img src={resolveImageUrl(item.image)} alt={item.name} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-col gap-2 p-3">
        <h3 className="text-sm font-bold text-ink">{item.name}</h3>

        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="افزودن به علاقه‌مندی‌ها"
            className="text-ink-muted hover:text-red-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </button>
          {item.discountPercent > 0 && (
            <span className="rounded-sm2 bg-red-50 px-1.5 py-0.5 text-xs font-bold text-red-500">
              ٪{item.discountPercent}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            {item.discountPercent > 0 && item.oldPrice && (
              <span className="text-xs text-ink-muted line-through">{item.oldPrice}</span>
            )}
            <span className="text-sm font-bold text-primary">{item.price} تومان</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-ink-muted">
            <StarRating rating={item.rating} />
            ({item.ratingCount})
          </span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-1 w-full rounded-full bg-primary py-2 text-xs font-bold text-white transition-colors hover:bg-primary-dark"
        >
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}

export default DishCard;