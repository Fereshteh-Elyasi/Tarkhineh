// ستاره‌های امتیاز، مشترک بین کارت غذا، نتایج جستجو و نظرات کاربران
function StarRating({ rating, size = 13 }) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={i <= rounded ? "" : "text-line"}
        >
          <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9" />
        </svg>
      ))}
    </span>
  );
}

export default StarRating;
