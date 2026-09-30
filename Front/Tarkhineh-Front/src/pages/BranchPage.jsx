import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { fetchBranchBySlug } from "../api/branchesApi";
import { fetchBranchDishes, fetchBranchReviews } from "../api/branchDishesApi";
import { resolveImageUrl } from "../api/client";
import BranchDishRow from "../components/BranchDishRow";
import StarRating from "../components/StarRating";
import HeroBanner from "../components/Herobanner";
import { heroSlides } from "../data/heroSlides";
import { toPersianDigits } from "../utils/format";

function BranchPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [branch, setBranch] = useState(null);
  const [dishes, setDishes] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;
    setStatus("loading");

    Promise.all([fetchBranchBySlug(slug), fetchBranchDishes(slug), fetchBranchReviews(slug)])
      .then(([branchData, dishesData, reviewsData]) => {
        if (!alive) return;
        setBranch(branchData);
        setDishes(dishesData);
        setReviews(reviewsData);
        setStatus("ready");
      })
      .catch(() => {
        if (alive) setStatus("error");
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  const submitSearch = () => {
    const query = searchValue.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  if (status === "loading") {
    return <p className="py-24 text-center text-sm text-ink-muted">در حال بارگذاری شعبه...</p>;
  }

  if (status === "error" || !branch) {
    return <p className="py-24 text-center text-sm text-ink-muted">شعبه‌ای با این آدرس پیدا نشد.</p>;
  }

  return (
    <>
      {/* هیرو بنر اصلاح‌شده */}
      <HeroBanner slides={heroSlides} showOrderButton={false} />

      <section className="py-6">
        <div className="mx-auto max-w-container px-4">
          <div className="flex items-center gap-2 rounded-full border border-line px-4 py-2.5 focus-within:border-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="جستجو"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>
      </section>

      <BranchDishRow title="پیشنهاد ویژه" items={dishes.featured} />
      <BranchDishRow title="غذاهای محبوب" items={dishes.popular} tinted />
      <BranchDishRow
        title="غذاهای غیر ایرانی"
        items={dishes.nonIranian}
        showMoreButton
        showMoreTo="/menu/main"
      />

      <section className="pt-10 pb-20">
        <div className="mx-auto max-w-container px-4">
          <h2 className="mb-4 text-xl font-bold text-ink">{branch.name}</h2>

          <div className="relative">
            <div className="h-72 w-full overflow-hidden rounded-lg2">
              <img src={resolveImageUrl(branch.image)} alt={branch.name} className="h-full w-full object-cover" />
            </div>

            <div className="relative z-10 mx-auto -mt-10 flex w-fit max-w-[92%] flex-col gap-4 rounded-lg2 border-2 border-primary bg-surface px-6 py-5 shadow-md2 sm:flex-row sm:items-center sm:gap-0 sm:divide-x sm:divide-line sm:[&>*]:px-6">
              <div className="flex items-center gap-2 text-sm text-ink">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-primary">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 16 14" />
                </svg>
                <span>{branch.workingHours}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-ink">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-primary">
                  <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{branch.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-ink">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-primary">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .7a2 2 0 0 1 1.7 2z" />
                </svg>
                <div className="flex flex-col" dir="ltr">
                  <span>{branch.phone1}</span>
                  <span>{branch.phone2}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="mx-auto max-w-container px-4">
          <h2 className="mb-6 text-xl font-bold text-ink">نظرات کاربران</h2>

          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            dir="rtl"
            breakpoints={{ 768:{ slidesPerView: 2 } }}
            className="pb-10 [--swiper-navigation-color:#2f6b3a] [--swiper-navigation-size:20px] [--swiper-pagination-color:#2f6b3a]">
            {reviews.map((r) => (
              <SwiperSlide key={r.id}>
                <div className="flex h-full flex-col justify-between gap-4 rounded-lg2 border border-line p-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <img src={resolveImageUrl(r.avatar)} alt={r.name} className="h-9 w-9 rounded-full object-cover" />
                      <strong className="text-sm text-ink">{r.name}</strong>
                      <span className="text-xs text-ink-muted">{r.date}</span>
                    </div>
                    <p className="text-sm leading-7 text-ink-muted">{r.text}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-ink">
                    <StarRating rating={r.rating} />
                    <span>{toPersianDigits(r.rating)}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
}

export default BranchPage;