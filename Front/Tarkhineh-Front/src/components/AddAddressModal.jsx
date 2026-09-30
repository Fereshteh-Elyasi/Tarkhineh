import { useCallback, useRef, useState } from "react";
import NeshanMap from "@neshan-maps-platform/react-openlayers";
import { fromLonLat, toLonLat } from "@neshan-maps-platform/ol/proj";
import { reverseGeocode } from "../utils/neshan";

const MAP_KEY = import.meta.env.VITE_NESHAN_MAP_KEY;
const DEFAULT_CENTER = { lat: 35.6997, lng: 51.338 }; // تهران، میدان ولیعصر تقریبی

function AddAddressModal({ onClose, onSave, initialData = null }) {
  const isEditing = Boolean(initialData);
  const mapObjRef = useRef(null); // نمونه‌ی خام نقشه (از onInit)، برای زوم/جابه‌جایی دستی
  const [step, setStep] = useState(isEditing ? "details" : "map"); // 'map' | 'details'
  const [center, setCenter] = useState(
    initialData?.lat && initialData?.lng ? { lat: initialData.lat, lng: initialData.lng } : DEFAULT_CENTER
  );
  const [locating, setLocating] = useState(false);
  const [isMoving, setIsMoving] = useState(false); // برای انیمیشن بالا رفتن پین حین جابه‌جایی نقشه
  const [pickedAddressText, setPickedAddressText] = useState(initialData?.fullAddress || "در حال دریافت آدرس...");

  const [label, setLabel] = useState(initialData?.label || "");
  const [isSelf, setIsSelf] = useState(initialData?.isSelf ?? true);
  const [recipientName, setRecipientName] = useState(initialData?.recipientName || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [fullAddress, setFullAddress] = useState(initialData?.fullAddress || "");
  const [formError, setFormError] = useState("");

  const updateAddressFromCenter = useCallback(async (lat, lng) => {
    const address = await reverseGeocode(lat, lng);
    setPickedAddressText(address);
  }, []);

  // وقتی نقشه برای اولین بار آماده شد
  const handleMapInit = (map) => {
    mapObjRef.current = map;
    map.on("movestart", () => setIsMoving(true));
    map.on("moveend", () => {
      setIsMoving(false);
      const view = map.getView();
      const [lng, lat] = toLonLat(view.getCenter());
      setCenter({ lat, lng });
      updateAddressFromCenter(lat, lng);
    });
    updateAddressFromCenter(center.lat, center.lng);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(next);
        const view = mapObjRef.current?.getView();
        view?.setCenter(fromLonLat([next.lng, next.lat]));
        view?.setZoom(16);
        updateAddressFromCenter(next.lat, next.lng);
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const handleZoom = (delta) => {
    const view = mapObjRef.current?.getView();
    if (!view) return;
    view.setZoom((view.getZoom() ?? 14) + delta);
  };

  const handleConfirmLocation = () => {
    setFullAddress(pickedAddressText);
    setStep("details");
  };

  const handleSubmitAddress = () => {
    if (!label.trim() || !fullAddress.trim()) {
      setFormError("لطفاً عنوان و آدرس دقیق را پر کنید.");
      return;
    }
    onSave({
      id: initialData?.id || `addr-${Date.now()}`,
      label: label.trim(),
      phone: phone.trim(),
      fullAddress: fullAddress.trim(),
      isSelf,
      recipientName: isSelf ? "" : recipientName.trim(),
      lat: center.lat,
      lng: center.lng,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg2 bg-surface shadow-md2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line p-4">
          <h2 className="text-base font-bold text-ink">
            {step === "map" ? (isEditing ? "ویرایش موقعیت آدرس" : "افزودن آدرس") : isEditing ? "ویرایش آدرس" : "ثبت آدرس"}
          </h2>
          <button aria-label="بستن" onClick={onClose} className="text-ink-muted hover:text-ink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {step === "map" ? (
          <div className="p-4">
            <div className="relative mb-3 h-64 w-full overflow-hidden rounded-md2 bg-surface-soft">
              {!MAP_KEY ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-xs text-ink-muted">
                  <p className="font-bold text-ink">کلید نقشه نشان تنظیم نشده</p>
                  <p>
                    مقدار <code dir="ltr">VITE_NESHAN_MAP_KEY</code> رو توی فایل <code dir="ltr">.env</code> پروژه‌ات
                    پر کن.
                  </p>
                </div>
              ) : (
                <NeshanMap
                  mapKey={MAP_KEY}
                  defaultType="neshan"
                  center={{
                    latitude: center.lat,
                    longitude: center.lng,
                  }}
                  zoom={15}
                  poi={false}
                  traffic={false}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  onInit={handleMapInit}
                />
              )}

              {/* پین ثابت وسط نقشه؛ خود نقشه زیرش حرکت می‌کنه. سایه دقیقاً روی نقطه‌ی مرکز می‌مونه و فقط خود پین بالا می‌ره */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`text-primary transition-transform duration-200 ease-out ${
                    isMoving ? "-translate-y-3" : "translate-y-0"
                  }`}
                >
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
                  <circle cx="12" cy="9" r="2.5" fill="white" />
                </svg>
                {/* سایه‌ی زیر پین: وقتی پین بالا می‌ره سایه کوچیک‌تر و کم‌رنگ‌تر می‌شه */}
                <span
                  className={`block rounded-full bg-black/30 blur-[1.5px] transition-all duration-200 ease-out ${
                    isMoving ? "h-1 w-2.5 opacity-30" : "h-1.5 w-4 opacity-50"
                  }`}
                />
              </div>

              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-bold text-ink shadow-sm2 transition-colors hover:bg-surface-soft disabled:opacity-70"
              >
                {locating ? "در حال یافتن..." : "موقعیت من"}
                <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                  {locating && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                  )}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative text-primary">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                  </svg>
                </span>
              </button>

              <div className="absolute left-3 top-3 flex flex-col overflow-hidden rounded-md2 shadow-sm2">
                <button
                  type="button"
                  onClick={() => handleZoom(1)}
                  className="flex h-8 w-8 items-center justify-center bg-surface text-ink hover:bg-surface-soft"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom(-1)}
                  className="flex h-8 w-8 items-center justify-center border-t border-line bg-surface text-ink hover:bg-surface-soft"
                >
                  −
                </button>
              </div>
            </div>

            <div className="mb-3 flex items-center gap-2 rounded-md2 border border-line px-3 py-2.5">
              <input
                type="text"
                value={pickedAddressText}
                onChange={(e) => setPickedAddressText(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none"
              />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-primary">
                <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>

            <button
              type="button"
              onClick={handleConfirmLocation}
              className="w-full rounded-full bg-primary py-2.5 font-bold text-white transition-colors hover:bg-primary-dark"
            >
              ثبت موقعیت
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-4">
            <input
              type="text"
              placeholder="عنوان آدرس (مثلاً خانه، محل کار...)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="rounded-md2 border border-line px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />

            <label className="flex items-center gap-2 text-sm text-ink">
              تحویل گیرنده خودم هستم
              <input
                type="checkbox"
                checked={isSelf}
                onChange={(e) => setIsSelf(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
            </label>

            {!isSelf && (
              <input
                type="text"
                placeholder="نام و نام‌خانوادگی تحویل گیرنده"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="rounded-md2 border border-line px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            )}

            <input
              type="text"
              dir="ltr"
              placeholder={isSelf ? "شماره همراه" : "شماره همراه تحویل گیرنده"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-md2 border border-line px-3 py-2 text-right text-sm focus:border-primary focus:outline-none"
            />

            <textarea
              rows="3"
              placeholder="آدرس دقیق شما"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              className="rounded-md2 border border-line px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />

            {formError && <p className="text-xs text-red-500">{formError}</p>}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("map")}
                className="flex-1 text-sm font-bold text-ink hover:text-primary"
              >
                ویرایش آدرس انتخابی
              </button>
              <button
                type="button"
                onClick={handleSubmitAddress}
                className="flex-1 rounded-full bg-primary py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
              >
                {isEditing ? "ذخیره تغییرات" : "ثبت آدرس"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddAddressModal;
