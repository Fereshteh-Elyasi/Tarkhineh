import NeshanMap from "@neshan-maps-platform/react-openlayers";

// TODO: مختصات و اطلاعات تماس فعلاً از src/data/branches.js خونده می‌شه.
// وقتی مفهوم «شعبه‌ی سفارش» به سبد خرید اضافه شد (مثلاً از مسیر /branch/:slug/menu)
// باید branch واقعی سفارش به‌جای شعبه‌ی پیش‌فرض به این کامپوننت پاس داده بشه.

const MAP_KEY = import.meta.env.VITE_NESHAN_MAP_KEY;

function BranchPickupInfo({ branch, workingHours, phone1, phone2 }) {
  const mapUrl = `https://www.openstreetmap.org/?mlat=${branch.lat}&mlon=${branch.lng}#map=16/${branch.lat}/${branch.lng}`;

  // مشکل اصلی نقشه: کانتینر قبلاً h-auto + min-h داشت، یعنی موقع مونت شدن نقشه
  // (که OpenLayers ابعادش رو یک‌بار از روی کانتینر می‌خونه) ارتفاع واقعی هنوز
  // مشخص نبود و نقشه با یه کادر خالی/نصفه رندر می‌شد. برای اطمینان کامل، بعد از
  // آماده شدن نقشه یک‌بار دیگه هم updateSize صدا زده می‌شه تا با ابعاد نهایی هماهنگ بشه.
  const handleMapInit = (map) => {
    requestAnimationFrame(() => map.updateSize());
    setTimeout(() => map.updateSize(), 200);
  };

  return (
    <div className="rounded-lg2 border border-line p-4">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-ink">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-primary">
          <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        آدرس {branch.name}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[240px_1fr]">
        {/* پیش‌نمایش نقشه */}
        <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-md2 bg-surface-soft sm:h-[190px]">
          {MAP_KEY ? (
            <NeshanMap
              mapKey={MAP_KEY}
              defaultType="neshan"
              center={{ latitude: branch.lat, longitude: branch.lng }}
              zoom={15}
              poi={false}
              traffic={false}
              style={{ width: "100%", height: "100%" }}
              onInit={handleMapInit}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-3 text-center text-[11px] text-ink-muted">
              <p className="font-bold text-ink">نقشه در دسترس نیست</p>
              <p>
                کلید <code dir="ltr">VITE_NESHAN_MAP_KEY</code> تنظیم نشده
              </p>
            </div>
          )}

          {/* پین ثابت روی موقعیت شعبه */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center text-primary">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
              <circle cx="12" cy="9" r="2.5" fill="white" />
            </svg>
            <span className="block h-1.5 w-4 rounded-full bg-black/30 blur-[1.5px]" />
          </div>
        </div>

        {/* اطلاعات شعبه */}
        <div className="flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-2.5">
            <p className="text-sm leading-6 text-ink">{branch.address}</p>

            <div className="flex items-center gap-1.5 text-xs text-ink-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 15" />
              </svg>
              <span>{workingHours}</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted" dir="ltr">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .7a2 2 0 0 1 1.7 2z" />
                </svg>
                {phone1}
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .7a2 2 0 0 1 1.7 2z" />
                </svg>
                {phone2}
              </span>
            </div>
          </div>

          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            مشاهده در نقشه
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default BranchPickupInfo;
