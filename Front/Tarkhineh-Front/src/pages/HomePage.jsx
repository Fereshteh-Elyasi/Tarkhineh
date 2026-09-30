import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import banner2 from "../assets/Images/banner2.jpg";
import beforeImg from "../assets/Images/before.png";
import afterImg from "../assets/Images/after.png";
import desertImg from "../assets/Images/desert.png";
import sodaImg from "../assets/Images/soda.png";
import { fetchBranches } from "../api/branchesApi";
import { resolveImageUrl } from "../api/client";
import HeroBanner from "../components/Herobanner";
import BranchPhotoModal from "../components/BranchPhotoModal";
import { heroSlides } from "../data/heroSlides";
import "./HomePage.css"

const categories = [
  { label: "غذای اصلی", image: beforeImg, tab: "main" },
  { label: "پیش غذا", image: afterImg, tab: "appetizer" },
  { label: "دسر", image: desertImg, tab: "dessert" },
  { label: "نوشیدنی", image: sodaImg, tab: "drink" },
];

const featureIcons = {
  chart: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="14 7 21 7 21 14" />
    </svg>
  ),
  user: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
    </svg>
  ),
  menu: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="13" y2="16" />
    </svg>
  ),
  home: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
};

const features = [
  { label: "کیفیت بالای غذاها", icon: "chart" },
  { label: "پرسنل مجرب و حرفه‌ای", icon: "user" },
  { label: "منوی متنوع", icon: "menu" },
  { label: "محیط دلنشین و آرام", icon: "home" },
];

function HomePage() {
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [photoModalBranch, setPhotoModalBranch] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchBranches().then((data) => {
      if (alive) {
        setBranches(data);
        setBranchesLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <HeroBanner slides={heroSlides} />

      {/* ===================== منوی رستوران ===================== */}
<section id="menu" className="py-8 bg-white mb-7">
  <div className="mx-auto max-w-container px-4">
    <h2 className="mb-10 text-center text-5xl font-bold text-ink md:text-2xl">
      منوی رستوران
    </h2>
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {categories.map((cat) => (
        <Link
          to={`/menu/${cat.tab}`}
          key={cat.label}
          className="group relative flex flex-col items-center pt-24"
        >
          {/* عکس غذا با موقعیت مطلق */}
          <div className="absolute top-0 z-10 flex h-48 w-48 items-center justify-center transition-transform duration-300 group-hover:scale-105 md:h-56 md:w-56">
            <img
              src={cat.image}
              alt={cat.label}
              className={`object-contain ${
                cat.tab === "main"
                  ? "img-main-dish"
                  : cat.tab === "appetizer"
                  ? "img-appetizer"
                  : cat.tab === "dessert"
                  ? "img-dessert"
                  : "img-drink"
              }`}
            />
          </div>

          {/* کارت سبز رنگ */}
          <div className="relative flex h-28 w-full flex-col items-center justify-end rounded-2xl bg-[#417F56] pb-3 shadow-md transition-all duration-300 group-hover:shadow-lg">
            {/* دکمه / عنوان سفید پایین کارت */}
            <div className="absolute -bottom-4 z-20 rounded-lg bg-white px-8 py-2 shadow-md transition-transform duration-300 group-hover:scale-105">
              <span className="text-sm font-bold text-gray-800 md:text-base">
                {cat.label}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>
      {/* ===================== رستوران‌های زنجیره‌ای ===================== */}
      <section className="relative bg-cover bg-center py-16 text-white" style={{ backgroundImage: `url(${banner2})` }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto grid max-w-container gap-10 px-4 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-8">
            {features.map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-3 text-center">
                <span className="text-primary">{featureIcons[f.icon]}</span>
                <span className="text-sm font-bold text-white/90">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center gap-4">
            <h2 className="text-2xl font-bold">رستوران‌های زنجیره‌ای ترخینه</h2>
            <p className="leading-8 text-white/85">
              مهمان‌نوازی یکی از مهم‌ترین مشخصه‌های ایرانیان است و باعث افتخار ماست که بیش از ۲۰ سال است که
              خدمت‌گزار مردم شریف ایران هستیم. ما در رستوران‌های زنجیره‌ای ترخینه همواره تلاش کردیم تا در محیطی
              اصیل، پایه معماری و طراحی مدرن در کنار طبیعی، دلنواز، غذای سالم و دنج شأن عزیزانمان ارائه دهیم.
            </p>
            <button className="flex w-fit items-center gap-2 rounded-full border border-white/40 px-5 py-2 font-bold text-white transition-colors hover:bg-white/10">
              اطلاعات بیشتر
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ===================== ترخینه گردی ===================== */}
      <section id="branches" className="py-14">
        <div className="mx-auto max-w-container px-4">
          <h2 className="mb-8 text-xl font-bold text-ink">ترخینه گردی</h2>

          {branchesLoading ? (
            <p className="text-center text-sm text-ink-muted">در حال بارگذاری شعبه‌ها...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {branches.map((b) => (
                <div key={b.slug} className="overflow-hidden rounded-lg2 border border-line transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative h-36 w-full">
                    <img src={resolveImageUrl(b.image)} alt={b.name} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoModalBranch(b)}
                      aria-label={`مشاهده عکس‌های ${b.name}`}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm2 transition-colors hover:bg-surface"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="7" width="18" height="14" rx="2" />
                        <path d="M8 7l1.5-3h5L16 7" />
                        <circle cx="12" cy="14" r="3.5" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 font-bold text-ink">{b.name}</h3>
                    <p className="mb-3 text-xs text-ink-muted">{b.address}</p>
                    <Link
                      to={`/branch/${b.slug}`}
                      className="inline-flex items-center gap-1 rounded-full border border-primary px-4 py-1.5 text-xs font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
                    >
                      صفحه شعبه
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {photoModalBranch && (
        <BranchPhotoModal branch={photoModalBranch} onClose={() => setPhotoModalBranch(null)} />
      )}
    </>
  );
}

export default HomePage;