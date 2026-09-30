// src/pages/ProfilePage.jsx
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "../components/LogoutModal";
import AddAddressModal from "../components/AddAddressModal";
import {
  fetchAddresses,
  createAddress,
  deleteAddress,
  updateAddress,
} from "../api/addressApi";
import { fetchOrders, cancelOrder } from "../api/orderApi";
import { fetchWishlist, removeFromWishlist } from "../api/wishlistApi";
import { updateProfile } from "../api/authApi";

// ====== آیکون‌های مشابه هدر ======
const Icons = {
  user: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  order: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3-5 3V6a2 2 0 0 1 2-2z" />
    </svg>
  ),
  heart: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  ),
  heartFilled: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  ),
  pin: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  logout: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  edit: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  close: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  calendar: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  chevronRight: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  chevronLeft: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  search: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  clock: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  ),
  bike: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M6 18l4-9h4l3 9M10 9h5" />
    </svg>
  ),
  star: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
    </svg>
  ),
};

// ====== تبدیل اعداد به فارسی ======
const toPersianDigits = (value) =>
  String(value).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

// ====== توابع تبدیل تاریخ میلادی <-> شمسی (الگوریتم jalaali) ======
const div = (a, b) => ~~(a / b);
const mod = (a, b) => a - ~~(a / b) * b;

function g2d(gy, gm, gd) {
  return (
    div(1461 * (gy + 4800 + div(gm - 14, 12)), 4) +
    div(367 * (gm - 2 - 12 * div(gm - 14, 12)), 12) -
    div(3 * div(gy + 4900 + div(gm - 14, 12), 100), 4) +
    gd -
    32075
  );
}

function d2g(jdn) {
  let j = 4 * jdn + 139361631;
  j += div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return [gy, gm, gd];
}

function jalCal(jy) {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178,
  ];
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jump = 0;
  let n;
  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  n = jy - jp;
  leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}

function j2d(jy, jm, jd) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn) {
  const gy = d2g(jdn)[0];
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  let jm;
  let jd;
  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31);
      jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  jm = 7 + div(k, 30);
  jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

const toJalaali = (gy, gm, gd) => d2j(g2d(gy, gm, gd));
const toGregorian = (jy, jm, jd) => d2g(j2d(jy, jm, jd));
const isLeapJalaaliYear = (jy) => jalCal(jy).leap === 0;
const jalaaliMonthLength = (jy, jm) => {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaaliYear(jy) ? 30 : 29;
};

const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
const JALALI_WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"]; // شنبه تا جمعه

// اولین روز هفته‌ی یک ماه شمسی، به‌صورت شاخصی که شنبه = ۰ باشد
function firstWeekdayOfJalaliMonth(jy, jm) {
  const [gy, gm, gd] = toGregorian(jy, jm, 1);
  const day = new Date(gy, gm - 1, gd).getDay(); // یکشنبه = ۰ ... شنبه = ۶
  return (day + 1) % 7;
}

// ====== کامپوننت انتخابگر تاریخ شمسی ======
const JalaliDatePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const today = useMemo(() => {
    const now = new Date();
    return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);
  const [viewYear, setViewYear] = useState(today.jy);
  const [viewMonth, setViewMonth] = useState(today.jm);

  const selected = useMemo(() => {
    if (!value) return null;
    const parts = value.split("/").map((p) => parseInt(p, 10));
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return { jy: parts[0], jm: parts[1], jd: parts[2] };
  }, [value]);

  const openPicker = () => {
    if (selected) {
      setViewYear(selected.jy);
      setViewMonth(selected.jm);
    }
    setOpen(true);
  };

  const daysInMonth = jalaaliMonthLength(viewYear, viewMonth);
  const leadingBlanks = firstWeekdayOfJalaliMonth(viewYear, viewMonth);

  const goPrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const goNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const pickDay = (jd) => {
    onChange(
      `${viewYear}/${String(viewMonth).padStart(2, "0")}/${String(jd).padStart(2, "0")}`,
    );
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openPicker}
        className="mt-1 flex w-full items-center justify-between rounded-md border border-line px-3 py-2 text-right focus:border-primary focus:outline-none"
      >
        <span className={value ? "text-ink" : "text-ink-muted"}>
          {value ? toPersianDigits(value) : "انتخاب تاریخ"}
        </span>
        <span className="text-ink-muted">{Icons.calendar}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-2 w-72 rounded-lg border border-line bg-surface p-3 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={goNextMonth}
                className="rounded-full p-1 text-ink-muted hover:bg-surface-soft"
                aria-label="ماه بعد"
              >
                {Icons.chevronRight}
              </button>
              <p className="font-bold text-ink">
                {JALALI_MONTHS[viewMonth - 1]} {toPersianDigits(viewYear)}
              </p>
              <button
                type="button"
                onClick={goPrevMonth}
                className="rounded-full p-1 text-ink-muted hover:bg-surface-soft"
                aria-label="ماه قبل"
              >
                {Icons.chevronLeft}
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs text-ink-muted">
              {JALALI_WEEKDAYS.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {Array.from({ length: leadingBlanks }).map((_, i) => (
                <span key={`blank-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                (jd) => {
                  const isSelected =
                    selected &&
                    selected.jy === viewYear &&
                    selected.jm === viewMonth &&
                    selected.jd === jd;
                  const isToday =
                    today.jy === viewYear &&
                    today.jm === viewMonth &&
                    today.jd === jd;
                  return (
                    <button
                      type="button"
                      key={jd}
                      onClick={() => pickDay(jd)}
                      className={`aspect-square rounded-full transition-colors ${
                        isSelected
                          ? "bg-primary font-bold text-white"
                          : isToday
                            ? "border border-primary text-primary"
                            : "text-ink hover:bg-surface-soft"
                      }`}
                    >
                      {toPersianDigits(jd)}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ====== تصویر جایگزین برای آیتم‌های غذایی (وقتی عکس واقعی نداریم) ======
const FoodImagePlaceholder = ({ className = "" }) => (
  <div
    className={`flex items-center justify-center bg-surface-soft text-ink-muted ${className}`}
  >
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 3v6M8 3v4a2 2 0 0 0 4 0M16 3c-1.5 0-2 2-2 4s.5 4 2 4M16 11v10" />
    </svg>
  </div>
);

// ====== مودال تأیید لغو سفارش ======
const OrderCancelModal = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="relative w-full max-w-sm rounded-lg bg-surface p-6 shadow-xl">
      <button
        onClick={onClose}
        className="absolute left-3 top-3 text-ink-muted hover:text-ink"
        aria-label="بستن"
      >
        {Icons.close}
      </button>
      <h3 className="mb-3 text-center text-lg font-bold text-ink">لغو سفارش</h3>
      <p className="mb-5 text-center text-sm text-ink-muted">
        آیا از لغو سفارش خود مطمئن هستید؟
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={onClose}
          className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
        >
          بازگشت
        </button>
        <button
          onClick={onConfirm}
          className="rounded-full border border-red-300 px-6 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
        >
          لغو سفارش
        </button>
      </div>
    </div>
  </div>
);

// ====== کارت آدرس ======
const AddressCard = ({
  address,
  isDefault,
  onSetDefault,
  onEdit,
  onDelete,
}) => (
  <div className="flex items-start justify-between border-b border-line py-4 last:border-b-0">
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <p className="font-bold text-ink">{address.label}</p>
        {isDefault && (
          <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-bold text-primary">
            پیش‌فرض
          </span>
        )}
      </div>
      <p className="text-sm text-ink-muted">{address.fullAddress}</p>
      <p className="text-xs text-ink-muted">{address.phone}</p>
    </div>
    <div className="flex flex-col items-end gap-1">
      {!isDefault && (
        <button
          onClick={onSetDefault}
          className="text-xs text-primary hover:underline"
        >
          پیش‌فرض
        </button>
      )}
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="text-xs text-ink-muted hover:text-ink"
        >
          ویرایش
        </button>
        <button
          onClick={onDelete}
          className="text-xs text-red-500 hover:text-red-700"
        >
          حذف
        </button>
      </div>
    </div>
  </div>
);

// ====== وضعیت‌های سفارش ======
const ORDER_FILTERS = [
  { key: "all", label: "همه" },
  { key: "active", label: "جاری" },
  { key: "delivered", label: "تحویل شده" },
  { key: "cancelled", label: "لغو شده" },
];
const STATUS_BADGE = {
  جاری: "bg-yellow-100 text-yellow-700",
  "تحویل شده": "bg-green-100 text-green-700",
  "لغو شده": "bg-red-100 text-red-700",
};
const STATUS_TO_FILTER = {
  جاری: "active",
  "تحویل شده": "delivered",
  "لغو شده": "cancelled",
};

// ====== کارت سفارش (گروه‌بندی‌شده بر اساس شعبه) ======
const OrderCard = ({ order, onCancel }) => (
  <div className="border-b border-line py-4 last:border-b-0">
    <div className="mb-2 flex flex-wrap items-center gap-2">
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_BADGE[order.status]}`}
      >
        {order.status}
      </span>
      <span className="flex items-center gap-1 text-xs text-ink-muted">
        {Icons.bike} {order.deliveryType}
      </span>
    </div>

    <p className="text-sm text-ink-muted">
      {order.date} · ساعت {toPersianDigits(order.time)}
    </p>
    {order.status === "جاری" && (
      <p className="mt-1 flex items-center gap-1 text-xs text-primary">
        {Icons.clock} تحویل تا {toPersianDigits(order.deliveryEstimate)}
      </p>
    )}
    {order.branch?.address && (
      <p className="mt-1 flex items-start gap-1 text-xs text-ink-muted">
        <span className="mt-0.5">{Icons.pin}</span>
        {order.branch.address}
      </p>
    )}
    <p className="mt-1 text-xs text-ink-muted">
      مبلغ: {toPersianDigits(order.total)} تومان
      {order.discount && <> · تخفیف: {toPersianDigits(order.discount)} تومان</>}
    </p>

    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
      {order.items.map((item, i) => (
        <div key={i} className="text-center">
          <FoodImagePlaceholder className="mx-auto h-16 w-16 rounded-lg" />
          <p className="mt-1 truncate text-xs text-ink">{item.name}</p>
          <p className="text-xs text-ink-muted">
            {toPersianDigits(item.price)} تومان
          </p>
        </div>
      ))}
    </div>

    <div className="mt-3">
      {order.status === "جاری" ? (
        <button
          onClick={() => onCancel(order)}
          className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-50"
        >
          لغو سفارش
        </button>
      ) : (
        <button className="rounded-full border border-primary px-4 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white">
          سفارش مجدد
        </button>
      )}
    </div>
  </div>
);

// ====== کارت غذا در علاقه‌مندی‌ها ======
const WishlistCard = ({ item, onToggleFavorite }) => (
  <div className="overflow-hidden rounded-lg border border-line">
    <div className="relative">
      <FoodImagePlaceholder className="h-36 w-full" />
      <button
        onClick={() => onToggleFavorite(item.id)}
        className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-red-500 shadow-sm"
        aria-label="حذف از علاقه‌مندی‌ها"
      >
        {Icons.heartFilled}
      </button>
    </div>
    <div className="p-3">
      <p className="font-bold text-ink">{item.name}</p>
      <div className="mt-1 flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          {toPersianDigits(item.price)} تومان
        </p>
        <span className="flex items-center gap-1 text-xs text-yellow-500">
          {Icons.star} {toPersianDigits(item.rating)}
        </span>
      </div>
      <button className="mt-2 w-full rounded-full bg-primary py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary-dark">
        افزودن به سبد خرید
      </button>
    </div>
  </div>
);

// ====== کامپوننت اصلی صفحه پروفایل ======
function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading, logout, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState(
    () => location.state?.tab || "profile",
  );

  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [addAddressOpen, setAddAddressOpen] = useState(false);

  const [orderFilter, setOrderFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);

  const [wishlistSearch, setWishlistSearch] = useState("");
  const [wishlistCategory, setWishlistCategory] = useState("all");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    displayName: "",
    birthDate: "",
    phone: "",
  });

  // ====== اگر کاربر وارد نشده، هدایت به صفحه اصلی ======
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  // ====== بارگذاری اطلاعات کاربر ======
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUserData = async () => {
      setPageLoading(true);
      try {
        const userData = user || {
          fullName: "",
          email: "",
          phone: "",
          displayName: "",
          birthDate: "",
        };

        const nameParts = userData.fullName
          ? userData.fullName.split(" ")
          : ["", ""];

        setFormData({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: userData.email || "",
          displayName: userData.displayName || "",
          birthDate: userData.birthDate || "",
          phone: userData.phone || "",
        });

        const [addressesData, ordersData, wishlistData] = await Promise.all([
          fetchAddresses(),
          fetchOrders(),
          fetchWishlist(),
        ]);

        setAddresses(addressesData);
        setOrders(ordersData);
        setWishlist(wishlistData);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات کاربر:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, user]);

  // ====== اعتبارسنجی شماره تلفن ======
  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length > 0 && digitsOnly.length < 11) {
      setPhoneError("شماره همراه باید ۱۱ رقم باشد");
      return false;
    }
    if (digitsOnly.length === 11 && !digitsOnly.startsWith("0")) {
      setPhoneError("شماره همراه باید با ۰ شروع شود");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // ====== مدیریت تغییرات فیلدها ======
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 11) {
        setFormData({ ...formData, [name]: digitsOnly });
        validatePhone(digitsOnly);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ====== ذخیره اطلاعات ======
  const handleSaveProfile = async () => {
    if (!formData.firstName.trim()) return alert("لطفاً نام خود را وارد کنید");
    if (!formData.lastName.trim())
      return alert("لطفاً نام خانوادگی خود را وارد کنید");
    if (!formData.email.trim()) return alert("لطفاً ایمیل خود را وارد کنید");
    if (!formData.phone || formData.phone.length !== 11) {
      return alert("لطفاً شماره همراه ۱۱ رقمی را وارد کنید");
    }

    try {
      const result = await updateProfile({
        fullName: `${formData.firstName} ${formData.lastName}`,
        displayName: formData.displayName,
        email: formData.email,
        birthDate: formData.birthDate,
      });
      updateUser(result.user);
      setIsEditing(false);
      alert("✅ اطلاعات شما با موفقیت ذخیره شد!");
    } catch (err) {
      alert("خطا در ذخیره‌ی اطلاعات: " + err.message);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    const nameParts = user?.fullName ? user.fullName.split(" ") : ["", ""];
    setFormData({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email: user?.email || "",
      displayName: user?.displayName || "",
      birthDate: user?.birthDate || "",
      phone: user?.phone || "",
    });
    setPhoneError("");
  };

  // ====== منوی کناری ======
  const menuItems = [
    { label: "پروفایل", icon: Icons.user, key: "profile" },
    { label: "پیگیری سفارشات", icon: Icons.order, key: "orders" },
    { label: "علاقه‌مندی‌ها", icon: Icons.heart, key: "wishlist" },
    { label: "آدرس‌های من", icon: Icons.pin, key: "addresses" },
  ];

  const handleLogout = () => setLogoutModalOpen(true);
  const confirmLogout = () => {
    logout();
    setLogoutModalOpen(false);
    navigate("/");
  };

  // ====== لغو سفارش ======
  const confirmCancelOrder = async () => {
    try {
      const updated = await cancelOrder(cancelTarget.id);
      setOrders(orders.map((o) => (o.id === cancelTarget.id ? updated : o)));
    } catch (err) {
      alert("خطا در لغو سفارش: " + err.message);
    } finally {
      setCancelTarget(null);
    }
  };

  // ====== فیلتر سفارش‌ها بر اساس شعبه ======
  const filteredOrdersByBranch = useMemo(() => {
    const filtered =
      orderFilter === "all"
        ? orders
        : orders.filter((o) => STATUS_TO_FILTER[o.status] === orderFilter);

    const groups = new Map();
    filtered.forEach((order) => {
      const key = order.branch?.name || "شعبه نامشخص";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(order);
    });
    return Array.from(groups.entries());
  }, [orders, orderFilter]);

  // ====== دسته‌بندی‌های علاقه‌مندی‌ها ======
  const WISHLIST_CATEGORIES = ["همه", "غذای اصلی", "پیش‌غذا", "دسر", "نوشیدنی"];
  const filteredWishlist = useMemo(() => {
    return wishlist.filter((item) => {
      const matchesCategory =
        wishlistCategory === "همه" || item.category === wishlistCategory;
      const matchesSearch = item.name.includes(wishlistSearch.trim());
      return matchesCategory && matchesSearch;
    });
  }, [wishlist, wishlistCategory, wishlistSearch]);

  const toggleWishlistFavorite = async (id) => {
    try {
      await removeFromWishlist(id);
      setWishlist(wishlist.filter((item) => item.id !== id));
    } catch (err) {
      alert("خطا در حذف از علاقه‌مندی‌ها: " + err.message);
    }
  };

  // ====== نمایش لودینگ ======
  if (loading || pageLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-container items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-ink-muted">در حال بارگذاری اطلاعات...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // ====== نمایش محتوا بر اساس تب فعال ======
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <section className="rounded-lg border border-line bg-surface p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">
                ویرایش اطلاعات شخصی
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 rounded-full bg-primary-light px-4 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  {Icons.edit}
                  ویرایش اطلاعات
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-ink-muted">نام</p>
                  <p className="mt-1 font-medium text-ink">
                    {formData.firstName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-ink-muted">نام خانوادگی</p>
                  <p className="mt-1 font-medium text-ink">
                    {formData.lastName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-ink-muted">آدرس ایمیل</p>
                  <p className="mt-1 font-medium text-ink">
                    {formData.email || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-ink-muted">شماره همراه</p>
                  <p className="mt-1 font-medium text-ink" dir="ltr">
                    {formData.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-ink-muted">نام نمایشی</p>
                  <p className="mt-1 font-medium text-ink">
                    {formData.displayName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-ink-muted">تاریخ تولد (اختیاری)</p>
                  <p className="mt-1 font-medium text-ink">
                    {formData.birthDate
                      ? toPersianDigits(formData.birthDate)
                      : "وارد نشده"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-ink-muted">
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-line px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="نام خانوادگی خود را وارد کنید"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-muted">
                      نام
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-line px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-muted">
                      شماره همراه
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      dir="ltr"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-md border px-3 py-2 text-right focus:outline-none ${
                        phoneError
                          ? "border-red-400 focus:border-red-400"
                          : "border-line focus:border-primary"
                      }`}
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    />
                    {phoneError && (
                      <p className="mt-1 text-xs text-red-500">{phoneError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-muted">
                      آدرس ایمیل
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-line px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="ایمیل خود را وارد کنید"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-muted">
                      تاریخ تولد (اختیاری)
                    </label>
                    <JalaliDatePicker
                      value={formData.birthDate}
                      onChange={(val) =>
                        setFormData({ ...formData, birthDate: val })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-muted">
                      نام نمایشی
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-line px-3 py-2 focus:border-primary focus:outline-none"
                      placeholder="نام نمایشی خود را وارد کنید"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
                  >
                    ذخیره اطلاعات
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex items-center gap-1 rounded-full border border-line px-6 py-2 text-sm font-bold text-ink transition-colors hover:bg-surface-soft"
                  >
                    {Icons.close}
                    انصراف
                  </button>
                </div>
              </div>
            )}
          </section>
        );

      case "orders":
        return (
          <section className="rounded-lg border border-line bg-surface p-4 md:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-ink">سفارشات</h2>
              <div className="flex flex-wrap gap-2">
                {ORDER_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setOrderFilter(f.key)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                      orderFilter === f.key
                        ? "bg-primary-light text-primary"
                        : "border border-line text-ink-muted hover:bg-surface-soft"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrdersByBranch.length > 0 ? (
              <div className="space-y-6">
                {filteredOrdersByBranch.map(([branchName, branchOrders]) => (
                  <div key={branchName}>
                    <h3 className="mb-1 text-sm font-bold text-ink">
                      {branchName}
                    </h3>
                    <div>
                      {branchOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onCancel={setCancelTarget}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-ink-muted">
                <p className="mb-4">
                  شما در حال حاضر هیچ سفارشی ثبت نکرده‌اید!
                </p>
                <Link
                  to="/menu/main"
                  className="inline-block rounded-full border border-primary px-5 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  منوی رستوران
                </Link>
              </div>
            )}
          </section>
        );

      case "wishlist":
        return (
          <section className="rounded-lg border border-line bg-surface p-4 md:p-6">
            <h2 className="mb-4 text-lg font-bold text-ink">علاقه‌مندی‌ها</h2>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">
                  {Icons.search}
                </span>
                <input
                  type="text"
                  value={wishlistSearch}
                  onChange={(e) => setWishlistSearch(e.target.value)}
                  placeholder="جستجو"
                  className="w-full rounded-full border border-line py-2 pl-3 pr-9 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {WISHLIST_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setWishlistCategory(cat)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                      wishlistCategory === cat
                        ? "bg-primary-light text-primary"
                        : "border border-line text-ink-muted hover:bg-surface-soft"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {wishlist.length === 0 ? (
              <div className="py-12 text-center text-ink-muted">
                <p className="mb-4">
                  شما در حال حاضر هیچ محصولی را به علاقه‌مندی‌ها اضافه
                  نکرده‌اید!
                </p>
                <Link
                  to="/menu/main"
                  className="inline-block rounded-full border border-primary px-5 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  منوی رستوران
                </Link>
              </div>
            ) : filteredWishlist.length === 0 ? (
              <div className="py-12 text-center text-ink-muted">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-soft">
                  {Icons.search}
                </div>
                <p>موردی با این مشخصات پیدا نکردیم!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWishlist.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    onToggleFavorite={toggleWishlistFavorite}
                  />
                ))}
              </div>
            )}
          </section>
        );

      case "addresses":
        return (
          <section className="rounded-lg border border-line bg-surface p-4 md:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-ink">آدرس‌های من</h2>
              <button
                onClick={() => setAddAddressOpen(true)}
                className="rounded-full bg-primary-light px-4 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                + افزودن آدرس
              </button>
            </div>
            <div>
              {addresses.length > 0 ? (
                addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isDefault={address.isDefault}
                    onSetDefault={async () => {
                      try {
                        await updateAddress(address.id, { isDefault: true });
                        setAddresses(
                          addresses.map((addr) => ({
                            ...addr,
                            isDefault: addr.id === address.id,
                          })),
                        );
                      } catch (err) {
                        alert("خطا: " + err.message);
                      }
                    }}
                    onEdit={() => alert(`ویرایش آدرس: ${address.label}`)}
                    onDelete={async () => {
                      if (!window.confirm("آیا از حذف این آدرس مطمئن هستید؟"))
                        return;
                      try {
                        await deleteAddress(address.id);
                        setAddresses(
                          addresses.filter((addr) => addr.id !== address.id),
                        );
                      } catch (err) {
                        alert("خطا در حذف آدرس: " + err.message);
                      }
                    }}
                  />
                ))
              ) : (
                <div className="py-8 text-center text-ink-muted">
                  <p>هیچ آدرسی ثبت نشده است.</p>
                  <button
                    onClick={() => setAddAddressOpen(true)}
                    className="mt-2 inline-block text-primary hover:underline"
                  >
                    افزودن اولین آدرس
                  </button>
                </div>
              )}
            </div>

            {addAddressOpen && (
              <AddAddressModal
                onClose={() => setAddAddressOpen(false)}
                onSave={async (address) => {
                  try {
                    const saved = await createAddress(address);
                    setAddresses((prev) => [...prev, saved]);
                    setAddAddressOpen(false);
                  } catch (err) {
                    alert("خطا در ثبت آدرس: " + err.message);
                  }
                }}
              />
            )}
          </section>
        );

      default:
        return null;
    }
  };

  // ====== رندر اصلی ======
  return (
    <>
      <div className="container mx-auto max-w-container px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* کارت پروفایل + منوی کناری */}
          <aside className="lg:w-64">
            <div className="rounded-lg border border-line bg-surface p-4">
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-surface-soft text-xl text-ink-muted">
                  {formData.firstName
                    ? formData.firstName.charAt(0)
                    : Icons.user}
                </div>
                <div>
                  <p className="font-bold text-ink">
                    {formData.firstName || "کاربر"} {formData.lastName || ""}
                  </p>
                  <p className="text-sm text-ink-muted" dir="ltr">
                    {formData.phone
                      ? toPersianDigits(formData.phone)
                      : "شماره ثبت نشده"}
                  </p>
                </div>
              </div>

              <ul className="mt-2 space-y-1">
                {menuItems.map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => setActiveTab(item.key)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        activeTab === item.key
                          ? "border-r-4 border-primary bg-primary-light/40 font-bold text-primary"
                          : "text-ink hover:bg-surface-soft"
                      }`}
                    >
                      <span
                        className={
                          activeTab === item.key
                            ? "text-primary"
                            : "text-ink-muted"
                        }
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
                <li className="border-t border-line pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
                  >
                    <span className="text-red-500">{Icons.logout}</span>
                    <span>خروج</span>
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          {/* محتوای اصلی */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>

      {/* ====== مودال خروج ====== */}
      {logoutModalOpen && (
        <LogoutModal
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={confirmLogout}
        />
      )}

      {/* ====== مودال لغو سفارش ====== */}
      {cancelTarget && (
        <OrderCancelModal
          onClose={() => setCancelTarget(null)}
          onConfirm={confirmCancelOrder}
        />
      )}
    </>
  );
}

export default ProfilePage;
