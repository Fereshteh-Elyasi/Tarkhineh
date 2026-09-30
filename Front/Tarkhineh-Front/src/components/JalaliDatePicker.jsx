// src/components/JalaliDatePicker.jsx
// انتخابگر تاریخ شمسی (جلالی) قابل استفاده مجدد — ابتدا داخل ProfilePage برای فیلد
// تاریخ تولد ساخته شد، بعداً برای فیلد «زمان ایده‌آل» در فرم مشاوره‌ی FranchisePage هم
// به همینجا منتقل شد تا هر دو صفحه از یک پیاده‌سازی مشترک استفاده کنند.
import { useState, useMemo } from "react";
import { toPersianDigits } from "../utils/format";

// ====== توابع تبدیل تاریخ میلادی <-> شمسی (الگوریتم jalaali)، فقط برای انتخابگر تاریخ تولد ======
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
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
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
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];
const JALALI_WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"]; // شنبه تا جمعه

function firstWeekdayOfJalaliMonth(jy, jm) {
  const [gy, gm, gd] = toGregorian(jy, jm, 1);
  const day = new Date(gy, gm - 1, gd).getDay(); // یکشنبه = ۰ ... شنبه = ۶
  return (day + 1) % 7;
}

// ====== کامپوننت انتخابگر تاریخ شمسی (برای تاریخ تولد) ======
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
    onChange(`${viewYear}/${String(viewMonth).padStart(2, "0")}/${String(jd).padStart(2, "0")}`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openPicker}
        className="mt-1 flex w-full items-center justify-between rounded-md2 border border-line px-3 py-2.5 text-right focus:border-primary focus:outline-none"
      >
        <span className={value ? "text-ink" : "text-ink-muted"}>
          {value ? toPersianDigits(value) : "انتخاب تاریخ"}
        </span>
        <span className="text-ink-muted">{<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-2 w-72 rounded-lg2 border border-line bg-surface p-3 shadow-sm2">
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={goNextMonth}
                className="rounded-full p-1 text-ink-muted hover:bg-surface-soft"
                aria-label="ماه بعد"
              >
                {<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>}
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
                {<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>}
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
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((jd) => {
                const isSelected =
                  selected && selected.jy === viewYear && selected.jm === viewMonth && selected.jd === jd;
                const isToday = today.jy === viewYear && today.jm === viewMonth && today.jd === jd;
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
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JalaliDatePicker;
