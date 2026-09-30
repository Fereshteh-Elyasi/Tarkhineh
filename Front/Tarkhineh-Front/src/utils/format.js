// ابزارهای مشترک تبدیل و فرمت‌بندی اعداد فارسی، قیمت و شماره تلفن
// این فایل قبلاً به صورت پراکنده داخل Home.jsx بود؛ الان یک‌بار در همه صفحات استفاده می‌شود.

export const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export const toEnglishDigits = (str) =>
  String(str).replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));

export const toPersianDigits = (str) =>
  String(str).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);

// تبدیل رشته قیمت فارسی (مثل "۱۳۶,۰۰۰") به عدد، برای مرتب‌سازی/جمع کل سبد
export const parsePrice = (priceStr) => {
  const digitsOnly = toEnglishDigits(priceStr).replace(/[^\d]/g, "");
  return digitsOnly ? parseInt(digitsOnly, 10) : 0;
};

export const formatPrice = (num) => toPersianDigits(Number(num).toLocaleString("en-US"));

export const formatPhoneGroups = (digits) => {
  const part1 = digits.slice(0, 4);
  const part2 = digits.slice(4, 7);
  const part3 = digits.slice(7, 11);
  return [part1, part2, part3].filter(Boolean).join(" ");
};

export const formatTimer = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

// یکسان‌سازی حروف عربی/فارسی مشابه (ي/ی و ك/ک) و فاصله‌ها، برای جستجوی قابل‌اعتماد
export const normalizeForSearch = (str) =>
  String(str)
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
