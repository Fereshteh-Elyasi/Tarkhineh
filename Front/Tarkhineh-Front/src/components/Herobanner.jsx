import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HeroBanner({ slides = [], showOrderButton = true }) {
  const [current, setCurrent] = useState(0);

  // اگر اسلایدی وجود نداشت
  if (!slides || slides.length === 0) {
    return (
      <div className="relative mb-6 w-full">
        <div className="flex h-[280px] w-full items-center justify-center bg-gray-200 md:h-[400px]">
          <p className="text-gray-500">اسلایدی برای نمایش وجود ندارد</p>
        </div>
      </div>
    );
  }

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goTo = (index) => {
    setCurrent(index);
  };

  // تنظیم تایمر چرخش خودمختار (فقط اگر بیشتر از ۱ اسلاید باشد)
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative mb-6 w-full">
      <div className="relative h-[280px] w-full overflow-hidden md:h-[400px]">
        {/* ====== تصویر فعلی ====== */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${slides[current]?.image})` }}
        >
          {/* هاور روی تصویر */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* ====== محتوای اسلاید ====== */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-white md:gap-4">
          <h1 className="max-w-2xl text-lg font-bold leading-snug md:text-2xl lg:text-3xl">
            {slides[current]?.title || "بدون عنوان"}
          </h1>
          {showOrderButton && (
            <Link
              to="/menu/main"
              className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white transition hover:scale-105 hover:bg-primary-dark md:px-8 md:py-2.5 md:text-base"
            >
              سفارش آنلاین غذا
            </Link>
          )}
        </div>

        {/* ====== نمایش کنترل‌ها فقط در صورتی که بیش از ۱ اسلاید وجود داشته باشد ====== */}
        {slides.length > 1 && (
          <>
            {/* دکمه قبلی (سمت راست) */}
            <button
              onClick={goPrev}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:scale-110 hover:bg-black/60 md:right-6 md:p-2.5"
              aria-label="قبلی"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* دکمه بعدی (سمت چپ) */}
            <button
              onClick={goNext}
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:scale-110 hover:bg-black/60 md:left-6 md:p-2.5"
              aria-label="بعدی"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* دات‌های زیر بنر */}
            <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2">
              <div className="flex items-center gap-2 rounded-full bg-black/20 px-3 py-1.5 backdrop-blur-sm md:gap-2.5 md:px-4">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 md:h-2 ${
                      i === current
                        ? "w-5 bg-[#4CAF50] shadow-lg shadow-[#4CAF50]/30 md:w-6"
                        : "w-1.5 bg-white/60 hover:bg-white/90 md:w-2"
                    }`}
                    aria-label={`اسلاید ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default HeroBanner;