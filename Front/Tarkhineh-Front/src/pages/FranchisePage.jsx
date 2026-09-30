// src/pages/FranchisePage.jsx
import { useCallback, useRef, useState } from "react";
import NeshanMap from "@neshan-maps-platform/react-openlayers";
import { fromLonLat, toLonLat } from "@neshan-maps-platform/ol/proj";
import { reverseGeocodeDetailed } from "../utils/neshan";
import JalaliDatePicker from "../components/JalaliDatePicker";
import franchiseHero from "../assets/Images/namayandegi.jpg"; 

const MAP_KEY = import.meta.env.VITE_NESHAN_MAP_KEY;
const DEFAULT_CENTER = { lat: 35.6997, lng: 51.338 }; // تهران، میدان ولیعصر تقریبی

// ====== آیکون‌های بخش «چرا نمایندگی ترخینه» ======
const featureIcons = {
  recipe: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="15" y2="11" />
    </svg>
  ),
  growth: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="5" y1="21" x2="5" y2="13" />
      <line x1="12" y1="21" x2="12" y2="9" />
      <line x1="19" y1="21" x2="19" y2="5" />
    </svg>
  ),
  wallet: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" />
      <path d="M3 7v10a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H6a2 2 0 0 1-2-2z" />
      <circle cx="16.5" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  building: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 21h18" />
      <path d="M4 21V9l8-5 8 5v12" />
      <line x1="9" y1="21" x2="9" y2="14" />
      <line x1="15" y1="21" x2="15" y2="14" />
      <line x1="9" y1="9" x2="9" y2="9" />
    </svg>
  ),
};

const heroFeatures = [
  { label: "بیش از ۲۰ شعبه فعال در سراسر کشور", icon: "building" },
  { label: "تسهیلات راه‌اندازی رستوران و تجهیز آن", icon: "wallet" },
  { label: "طرح‌های تشویقی ارتقای فروش", icon: "growth" },
  { label: "اعطای دستورالعمل پخت غذاها", icon: "recipe" },
];

const benefitsRight = [
  "مشاوره در امور حقوقی، مالی و مالیاتی",
  "پشتیبانی بازاریابی و منابع انسانی",
  "دریافت مشاوره جهت تامین مواد اولیه و تجهیزات",
  "طرح های تشویقی برای ارتقا فروش",
];
const benefitsLeft = [
  "استفاده از برند شناخته شده ترخینه",
  "به حداقل رساندن ریسک سرمایه گذاری",
  "تسریع روند بازگشت سرمایه",
  "مشاوره های تخصصی جهت مدیریت رستوران",
];
// هر ردیف یک آیتم راست + یک آیتم چپ، برای گرید ۲‌ستونه‌ی دقیقاً مطابق طرح
const benefitRows = benefitsRight.map((r, i) => [r, benefitsLeft[i]]).flat();

const DiamondBullet = () => <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px] border-2 border-primary" />;

// ====== لیست استان‌های کشور (برای فیلد «استان» در فرم درخواست نمایندگی) ======
const IRAN_PROVINCES = [
  "آذربایجان شرقی", "آذربایجان غربی", "اردبیل", "اصفهان", "البرز", "ایلام",
  "بوشهر", "تهران", "چهارمحال و بختیاری", "خراسان جنوبی", "خراسان رضوی",
  "خراسان شمالی", "خوزستان", "زنجان", "سمنان", "سیستان و بلوچستان", "فارس",
  "قزوین", "قم", "کردستان", "کرمان", "کرمانشاه", "کهگیلویه و بویراحمد",
  "گلستان", "گیلان", "لرستان", "مازندران", "مرکزی", "هرمزگان", "همدان", "یزد",
];

// ====== دراپ‌داون انتخاب استان (لیست قابل اسکرول، دقیقاً مطابق طرح Figma) ======
const ProvinceSelect = ({ value, onChange, placeholder = "استان" }) => {
  const [open, setOpen] = useState(false);

  const handlePick = (province) => {
    onChange(province);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-md2 border border-line px-3 py-2.5 text-right text-sm focus:border-primary focus:outline-none"
      >
        <span className={value ? "text-ink" : "text-ink-muted"}>{value || placeholder}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`shrink-0 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md2 border border-line bg-surface shadow-sm2">
            {IRAN_PROVINCES.map((province) => (
              <button
                key={province}
                type="button"
                onClick={() => handlePick(province)}
                className={`block w-full px-3 py-2 text-right text-sm transition-colors hover:bg-surface-soft ${
                  value === province ? "bg-primary-light font-bold text-primary" : "text-ink"
                }`}
              >
                {province}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ====== نقشه‌ی انتخاب موقعیت ملک (همون منطق AddAddressModal، به‌صورت این‌لاین داخل صفحه) ======
const PropertyLocationPicker = ({ onConfirm }) => {
  const mapObjRef = useRef(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [locating, setLocating] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleMapInit = (map) => {
    mapObjRef.current = map;
    map.on("movestart", () => setIsMoving(true));
    map.on("moveend", () => {
      setIsMoving(false);
      const view = map.getView();
      const [lng, lat] = toLonLat(view.getCenter());
      setCenter({ lat, lng });
    });
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

  const handleConfirm = async () => {
    setConfirming(true);
    const details = await reverseGeocodeDetailed(center.lat, center.lng);
    setConfirming(false);
    onConfirm({ ...details, lat: center.lat, lng: center.lng });
  };

  return (
    <div>
      <div className="relative h-56 w-full overflow-hidden rounded-md2 bg-surface-soft">
        {!MAP_KEY ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-xs text-ink-muted">
            <p className="font-bold text-ink">کلید نقشه نشان تنظیم نشده</p>
            <p>
              مقدار <code dir="ltr">VITE_NESHAN_MAP_KEY</code> رو توی فایل <code dir="ltr">.env</code> پروژه‌ات پر
              کن.
            </p>
          </div>
        ) : (
          <NeshanMap
            mapKey={MAP_KEY}
            defaultType="neshan"
            center={{ latitude: center.lat, longitude: center.lng }}
            zoom={15}
            poi={false}
            traffic={false}
            style={{ width: "100%", height: "100%" }}
            onInit={handleMapInit}
          />
        )}

        <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`text-primary transition-transform duration-200 ease-out ${
              isMoving ? "-translate-y-3" : "translate-y-0"
            }`}
          >
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
            <circle cx="12" cy="9" r="2.5" fill="white" />
          </svg>
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

      <button
        type="button"
        onClick={handleConfirm}
        disabled={confirming}
        className="mt-3 w-full rounded-full bg-primary py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-70"
      >
        {confirming ? "در حال دریافت آدرس..." : "ثبت موقعیت"}
      </button>
    </div>
  );
};

const facilityOptions = [
  { key: "hasBusinessLicense", label: "پروانه کسب دارد." },
  { key: "hasKitchen", label: "آشپزخانه دارد." },
  { key: "hasParking", label: "پارکینگ دارد." },
  { key: "hasStorage", label: "انبار دارد." },
];

function FranchisePage() {
  // فرم کوچک «دریافت مشاوره»
  const [consult, setConsult] = useState({ fullName: "", phone: "", idealTime: "" });
  const [consultSent, setConsultSent] = useState(false);

  // فرم بزرگ «درخواست نمایندگی»
  const [applicant, setApplicant] = useState({ fullName: "", nationalId: "", phone: "" });
  const [address, setAddress] = useState({ city: "", state: "", fullAddress: "", district: "" });
  const [property, setProperty] = useState({ buildingAge: "", area: "", ownershipType: "" });
  const [facilities, setFacilities] = useState({
    hasBusinessLicense: false,
    hasParking: false,
    hasKitchen: false,
    hasStorage: false,
  });
  const [propertyImages, setPropertyImages] = useState([]);
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const handleLocationConfirm = ({ fullAddress, city, state, district, lat, lng }) => {
    setAddress({ city, state, fullAddress, district, lat, lng });
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    setPropertyImages((prev) => [...prev, ...files]);
  };

  const toggleFacility = (key) => {
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConsultSubmit = () => {
    if (!consult.fullName.trim() || !consult.phone.trim()) return;
    // TODO: اتصال به بک‌اند واقعی برای ثبت درخواست مشاوره
    setConsultSent(true);
    setConsult({ fullName: "", phone: "", idealTime: "" });
  };

  const handleSubmit = () => {
    if (!applicant.fullName.trim() || !applicant.phone.trim() || !applicant.nationalId.trim()) {
      setFormError("لطفاً مشخصات فردی متقاضی را کامل کنید.");
      return;
    }
    if (!address.fullAddress.trim()) {
      setFormError("لطفاً موقعیت ملک را روی نقشه انتخاب کنید.");
      return;
    }
    setFormError("");
    // TODO: اتصال به بک‌اند واقعی برای ثبت فرم درخواست نمایندگی (شامل آپلود واقعی propertyImages)
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-container px-4 py-24 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-ink">درخواست شما با موفقیت ثبت شد!</h2>
        <p className="text-ink-muted">کارشناسان ترخینه پس از بررسی مدارک، با شما تماس خواهند گرفت.</p>
      </div>
    );
  }

  return (
    <div>
      {/* ====== هیرو ====== */}
      <section className="relative h-[280px] overflow-hidden bg-cover bg-center md:h-[380px]" style={{ backgroundImage: `url(${franchiseHero})` }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <h1 className="max-w-2xl text-center text-xl font-bold text-white md:text-3xl">
            همین الان به خانواده بزرگ ترخینه بپیوندید!
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-container px-4">
        {/* ====== چرا نمایندگی ترخینه ====== */}
        <section className="grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4">
          {heroFeatures.map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-3 px-2 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary text-primary">
                {featureIcons[f.icon]}
              </span>
              <span className="text-sm font-bold text-ink">{f.label}</span>
            </div>
          ))}
        </section>

        {/* ====== مزیت دریافت نمایندگی ====== */}
        <section className="border-t border-line py-10">
          <h2 className="mb-8 text-center text-xl font-bold text-ink">مزیت دریافت نمایندگی</h2>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
            {benefitRows.map((b, i) => {
              const isRightColumn = i % 2 === 0; // آیتم فرد در ردیف = ستون راست، بولت رو به بیرون (راست)
              return (
                <div key={b} className="flex items-start gap-2 text-right">
                  {isRightColumn && <DiamondBullet />}
                  <span className="text-sm text-ink">{b}</span>
                  {!isRightColumn && <DiamondBullet />}
                </div>
              );
            })}
          </div>
        </section>

        {/* ====== دریافت مشاوره ====== */}
        <section className="border-t border-line py-10">
          <h2 className="mb-6 text-center text-xl font-bold text-ink">دریافت مشاوره</h2>
          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                placeholder="نام و نام‌خانوادگی"
                value={consult.fullName}
                onChange={(e) => setConsult({ ...consult, fullName: e.target.value })}
                className="rounded-md2 border border-line px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                dir="ltr"
                placeholder="شماره تماس"
                value={consult.phone}
                onChange={(e) => setConsult({ ...consult, phone: e.target.value })}
                className="rounded-md2 border border-line px-3 py-2.5 text-right text-sm focus:border-primary focus:outline-none"
              />
              <JalaliDatePicker
                value={consult.idealTime}
                onChange={(val) => setConsult({ ...consult, idealTime: val })}
              />
            </div>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleConsultSubmit}
                className="rounded-full bg-primary px-8 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
              >
                درخواست مشاوره
              </button>
            </div>
            {consultSent && (
              <p className="mt-3 text-center text-sm font-bold text-primary">
                درخواست شما ثبت شد؛ به‌زودی با شما تماس می‌گیریم.
              </p>
            )}
          </div>
        </section>

        {/* ====== فرم درخواست نمایندگی ====== */}
        <section className="border-t border-line py-10">
          <div className="mx-auto max-w-3xl rounded-lg2 border border-line bg-surface p-5 shadow-sm2 md:p-8">
            <h2 className="mb-6 text-lg font-bold text-ink">فرم درخواست نمایندگی</h2>

            {/* مشخصات فردی متقاضی */}
            <h3 className="mb-3 text-sm font-bold text-ink">مشخصات فردی متقاضی</h3>
            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                placeholder="نام و نام‌خانوادگی"
                value={applicant.fullName}
                onChange={(e) => setApplicant({ ...applicant, fullName: e.target.value })}
                className="rounded-md2 border border-line px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                dir="ltr"
                placeholder="کدملی"
                value={applicant.nationalId}
                onChange={(e) => setApplicant({ ...applicant, nationalId: e.target.value })}
                className="rounded-md2 border border-line px-3 py-2.5 text-right text-sm focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                dir="ltr"
                placeholder="شماره تماس"
                value={applicant.phone}
                onChange={(e) => setApplicant({ ...applicant, phone: e.target.value })}
                className="rounded-md2 border border-line px-3 py-2.5 text-right text-sm focus:border-primary focus:outline-none"
              />
            </div>

            {/* آدرس ملک متقاضی */}
            <h3 className="mb-3 text-sm font-bold text-ink">آدرس ملک متقاضی</h3>
            <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
              {/* ستون راست (بیرونی): استان و منطقه */}
              <div className="flex flex-col gap-3">
                <ProvinceSelect value={address.state} onChange={(val) => setAddress({ ...address, state: val })} />
                <input
                  type="text"
                  placeholder="منطقه"
                  value={address.district}
                  onChange={(e) => setAddress({ ...address, district: e.target.value })}
                  className="rounded-md2 border border-line px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              {/* ستون وسط: شهر و آدرس دقیق */}
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="شهر"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="rounded-md2 border border-line px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
                <textarea
                  rows={2}
                  placeholder="آدرس دقیق"
                  value={address.fullAddress}
                  onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
                  className="flex-1 rounded-md2 border border-line px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              {/* ستون چپ (بیرونی): نقشه */}
              <PropertyLocationPicker onConfirm={handleLocationConfirm} />
            </div>

            {/* مشخصات ملک متقاضی */}
            <h3 className="mb-3 text-sm font-bold text-ink">مشخصات ملک متقاضی</h3>
            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                placeholder="نوع مالکیت"
                value={property.ownershipType}
                onChange={(e) => setProperty({ ...property, ownershipType: e.target.value })}
                className="rounded-md2 border border-line px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="مساحت ملک (متر مربع)"
                value={property.area}
                onChange={(e) => setProperty({ ...property, area: e.target.value })}
                className="rounded-md2 border border-line px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="سن بنا"
                value={property.buildingAge}
                onChange={(e) => setProperty({ ...property, buildingAge: e.target.value })}
                className="rounded-md2 border border-line px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            {/* امکانات ملک متقاضی */}
            <h3 className="mb-3 text-sm font-bold text-ink">امکانات ملک متقاضی</h3>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-bold text-ink-muted">ملک متقاضی:</p>
                <div className="grid grid-cols-2 gap-3">
                  {facilityOptions.map((opt) => (
                    <label key={opt.key} className="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="checkbox"
                        checked={facilities[opt.key]}
                        onChange={() => toggleFacility(opt.key)}
                        className="h-4 w-4 accent-primary"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold text-ink-muted">تصاویر ملک</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-md2 border-2 border-dashed border-line text-center text-xs text-ink-muted transition-colors hover:border-primary hover:text-primary"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {propertyImages.length > 0
                    ? `${propertyImages.length} تصویر انتخاب شد — برای افزودن بیشتر کلیک کنید`
                    : "تصویری از ملک را بارگذاری کنید..."}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesSelected}
                  className="hidden"
                />
              </div>
            </div>

            {formError && <p className="mb-3 text-sm text-red-500">{formError}</p>}

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-full bg-primary py-3 font-bold text-white transition-colors hover:bg-primary-dark sm:w-auto sm:px-10"
            >
              ثبت اطلاعات
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default FranchisePage;
