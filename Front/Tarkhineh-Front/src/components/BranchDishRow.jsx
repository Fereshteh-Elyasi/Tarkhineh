import { useRef } from "react";
import DishCard from "./DishCard";

// ردیف افقی غذاهای پیشنهادی صفحه شعبه (پیشنهاد ویژه / محبوب / غیر ایرانی)
function BranchDishRow({ title, items, tinted, showMoreButton, showMoreTo }) {
  const scrollerRef = useRef(null);

  const scrollByAmount = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  return (
    <section className={tinted ? "bg-primary-dark py-10" : "py-10"}>
      <div className="container mx-auto max-w-container px-4">
        <div className="mb-5 flex items-center justify-between">
          <h2 className={`text-xl font-bold ${tinted ? "text-white" : "text-ink"}`}>{title}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByAmount(1)}
              aria-label="مورد بعدی"
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                tinted
                  ? "border-white/40 text-white hover:bg-white/10"
                  : "border-line text-ink-muted hover:bg-surface-soft"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(-1)}
              aria-label="مورد قبلی"
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                tinted
                  ? "border-white/40 text-white hover:bg-white/10"
                  : "border-line text-ink-muted hover:bg-surface-soft"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={scrollerRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {items.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </div>

        {showMoreButton && (
          <div className="mt-6 text-center">
            <a
              href={showMoreTo}
              className="inline-block rounded-full border border-primary px-6 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              مشاهده منوی کامل
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export default BranchDishRow;
