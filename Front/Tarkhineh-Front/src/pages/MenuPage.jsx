import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import MenuItemCard from "../components/MenuItemCard";
// اصلاح نام فایل به Herobanner
import HeroBanner from "../components/Herobanner";
import { heroSlides } from "../data/heroSlides";
import { fetchTypeTabs, fetchMenuItems } from "../api/menuApi";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "../api/wishlistApi";
import { useAuth } from "../context/AuthContext";
import { parsePrice, normalizeForSearch } from "../utils/format";

function MenuPage() {
  const { tab = "main" } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [typeTabs, setTypeTabs] = useState([]);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // 'loading' | 'ready' | 'error'

  const [activePill, setActivePill] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState(() => new Set());

  // فچ لیست تب‌ها یک‌بار در ابتدا
  useEffect(() => {
    fetchTypeTabs().then(setTypeTabs);
  }, []);

  // فچ علاقه‌مندی‌های کاربر (فقط اگه لاگین باشه)
  useEffect(() => {
    if (!isAuthenticated) {
      setWishlist(new Set());
      return;
    }
    fetchWishlist().then((data) => {
      setWishlist(new Set(data.map((item) => item.id)));
    });
  }, [isAuthenticated]);

  // فچ آیتم‌های همون تب، هر بار که تب عوض بشه (از طریق URL)
  useEffect(() => {
    let alive = true;
    setStatus("loading");
    setActivePill("all");
    setSearchQuery("");

    fetchMenuItems(tab)
      .then((data) => {
        if (!alive) return;
        setItems(data);
        setStatus("ready");
      })
      .catch(() => {
        if (alive) setStatus("error");
      });

    return () => {
      alive = false;
    };
  }, [tab]);

  const categoryPills = useMemo(() => {
    const seen = new Map();
    items.forEach((item) => {
      if (!seen.has(item.category)) seen.set(item.category, item.categoryLabel);
    });
    const dynamicPills = Array.from(seen, ([id, label]) => ({ id, label }));
    return [
      ...dynamicPills,
      { id: "bestseller", label: "پرفروش‌ترین" },
      { id: "cheapest", label: "ارزان‌ترین" },
      { id: "all", label: "همه" },
    ];
  }, [items]);

  const filteredItems = useMemo(() => {
    let list = items;
    const q = normalizeForSearch(searchQuery);
    if (q) {
      list = list.filter(
        (item) =>
          normalizeForSearch(item.title).includes(q) || normalizeForSearch(item.description).includes(q)
      );
    }
    if (activePill === "cheapest") {
      list = [...list].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (activePill === "bestseller") {
      list = list.filter((item) => item.isBestseller);
    } else if (activePill !== "all") {
      list = list.filter((item) => item.category === activePill);
    }
    return list;
  }, [items, searchQuery, activePill]);

  const groupedSections = useMemo(() => {
    if (activePill !== "all") {
      const label = categoryPills.find((p) => p.id === activePill)?.label ?? "";
      return filteredItems.length ? [{ id: activePill, label, items: filteredItems }] : [];
    }
    const order = [];
    const map = new Map();
    filteredItems.forEach((item) => {
      if (!map.has(item.category)) {
        const group = { id: item.category, label: item.categoryLabel, items: [] };
        map.set(item.category, group);
        order.push(group);
      }
      map.get(item.category).items.push(item);
    });
    return order;
  }, [filteredItems, activePill, categoryPills]);

  const toggleWish = async (id) => {
    if (!isAuthenticated) {
      alert("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید");
      return;
    }
    const isWished = wishlist.has(id);
    setWishlist((prev) => {
      const next = new Set(prev);
      isWished ? next.delete(id) : next.add(id);
      return next;
    });
    try {
      if (isWished) {
        await removeFromWishlist(id);
      } else {
        await addToWishlist(id);
      }
    } catch (err) {
      // اگه درخواست شکست خورد، تغییر رو برگردون
      setWishlist((prev) => {
        const next = new Set(prev);
        isWished ? next.add(id) : next.delete(id);
        return next;
      });
    }
  };

  return (
    <>
      {/* ---------- بنر بالای صفحه (همون بنر صفحه اصلی) ---------- */}
      <HeroBanner slides={heroSlides} showOrderButton={false} />

      {/* ---------- نوار طوسی تب‌های اصلی نوع غذا ---------- */}
      <div className="bg-surface-soft">
        <div className="mx-auto flex max-w-container items-center gap-6 overflow-x-auto px-4">
          {typeTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate(`/menu/${t.id}`)}
              className={`whitespace-nowrap border-b-2 pb-3 pt-3 text-sm transition-colors ${
                tab === t.id ? "border-primary font-bold text-primary" : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-container px-4 py-7">

      {status === "loading" ? (
        <p className="py-24 text-center text-sm text-ink-muted">در حال بارگذاری منو...</p>
      ) : status === "error" ? (
        <p className="py-24 text-center text-sm text-ink-muted">مشکلی در دریافت منو پیش آمد.</p>
      ) : (
        <>
          {/* ---------- ردیف جستجو + پیل‌های دسته‌بندی (سوییپر واقعی) ---------- */}
          <div className="mb-6 flex items-center gap-3">
            <Swiper
              modules={[FreeMode]}
              freeMode
              slidesPerView="auto"
              spaceBetween={10}
              dir="rtl"
              className="min-w-0 flex-1"
            >
              {categoryPills.map((pill) => (
                <SwiperSlide key={pill.id} className="!w-auto">
                  <button
                    type="button"
                    onClick={() => setActivePill(pill.id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                      activePill === pill.id
                        ? "bg-primary-dark text-white"
                        : "bg-surface-soft text-ink-muted hover:bg-primary-light hover:text-primary"
                    }`}
                  >
                    {pill.label}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="flex w-[230px] shrink-0 items-center gap-2 rounded-full border border-line px-4 py-2.5 focus-within:border-primary">
              <input
                type="text"
                placeholder="جستجوی غذا..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-w-0 bg-transparent text-sm focus:outline-none"
              />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink-muted">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          {/* ---------- دکمه تکمیل خرید (سمت چپ صفحه) ---------- */}
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="mb-6 mr-auto flex w-fit items-center gap-2 rounded-full border border-primary bg-surface px-5 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            تکمیل خرید
          </button>

          {/* ---------- بخش‌های منو به تفکیک دسته ---------- */}
          {groupedSections.length > 0 ? (
            groupedSections.map((section) => (
              <section key={section.id} className="mb-2">
                <h2 className="mb-4 text-right text-lg font-bold text-ink">{section.label}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {section.items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      wished={wishlist.has(item.id)}
                      onToggleWish={() => toggleWish(item.id)}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="py-10 text-center text-sm text-ink-muted">در این دسته‌بندی در حال حاضر غذایی موجود نیست.</p>
          )}
        </>
      )}
      </div>
    </>
  );
}

export default MenuPage;