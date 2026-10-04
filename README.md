# ترخینه — سامانه سفارش آنلاین غذا

سایت مدرن سفارش آنلاین غذاهای ایرانی و خارجی، همراه با صفحات شعب رستوران، سبد خرید، پرداخت و پنل کاربری.

فرانت‌اند با **React + Vite + Tailwind** و بک‌اند با **PHP خام + MySQL** پیاده‌سازی شده است.

---

## شروع سریع

کدها داخل زیرپوشه هستند:

| بخش | مسیر |
|------|------|
| فرانت‌اند | `Front/Tarkhineh-Front` |
| بک‌اند | `Back/tarkhineh-Back` |

### بک‌اند (ترمینال ۱)

```bash
cd Back/tarkhineh-Back
# دیتابیس را بسازید (یک‌بار):
mysql -u root -p --default-character-set=utf8mb4 < database/schema.sql
mysql -u root -p --default-character-set=utf8mb4 < database/seed.sql
# در config/config.php رمز دیتابیس را تنظیم کنید، سپس:
php -S localhost:8000 index.php
```

### فرانت‌اند (ترمینال ۲)

```bash
cd Front/Tarkhineh-Front
npm install
npm run dev
```

سپس مرورگر را روی آدرس Vite (معمولاً `http://localhost:5173`) باز کنید.

---

## ویژگی‌ها

- منوی غذا با دسته‌بندی و جستجو
- صفحات اختصاصی شعب رستوران (غذاها، نظرات، تصاویر)
- سبد خرید و فرآیند تکمیل سفارش
- احراز هویت با شماره موبایل و کد OTP
- مدیریت آدرس‌های تحویل
- علاقه‌مندی‌ها (Wishlist)
- کد تخفیف و هزینه ارسال
- نقشه (Neshan Maps)
- طراحی واکنش‌گرا با Tailwind CSS

---

## ساختار پروژه

```text
Tarkhineh/
├── Front/
│   └── Tarkhineh-Front/     # اپلیکیشن React (Vite)
├── Back/
│   └── tarkhineh-Back/      # API با PHP خام
├── .gitignore
└── README.md
```

---

## پیش‌نیازها

| ابزار | نسخه پیشنهادی |
|--------|----------------|
| PHP | ۸.۳ یا بالاتر |
| MySQL / MariaDB | ۱۰.۱۱ یا بالاتر |
| Node.js | ۱۸ یا بالاتر |
| npm | ۹ یا بالاتر |

---

## راه‌اندازی کامل بک‌اند

```bash
cd Back/tarkhineh-Back
```

### ۱. ساخت دیتابیس

```bash
mysql -u root -p --default-character-set=utf8mb4 < database/schema.sql
mysql -u root -p --default-character-set=utf8mb4 < database/seed.sql
```

> حتماً از `utf8mb4` استفاده کنید تا متون فارسی درست ذخیره شوند.

### ۲. تنظیمات

فایل `config/config.php` را ویرایش کنید:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'tarkhineh');
define('DB_USER', 'root');
define('DB_PASS', 'رمز-دیتابیس-شما');
define('CORS_ALLOWED_ORIGIN', 'http://localhost:5173');
```

### ۳. اجرای سرور

```bash
php -S localhost:8000 index.php
```

API: `http://localhost:8000/api/...`

---

## راه‌اندازی کامل فرانت‌اند

```bash
cd Front/Tarkhineh-Front
npm install
npm run dev
```

برای اتصال به API، فایل `.env` در همین پوشه:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

ساخت نسخه نهایی:

```bash
npm run build
```

---

## API اصلی

مسیرهای 🔒 نیاز به هدر `Authorization: Bearer <token>` دارند.

### احراز هویت
| متد | مسیر | توضیح |
|-----|------|--------|
| POST | `/api/auth/send-otp` | ارسال کد OTP |
| POST | `/api/auth/verify-otp` | تأیید کد و دریافت توکن |
| POST | `/api/auth/logout` 🔒 | خروج |
| GET | `/api/auth/me` 🔒 | اطلاعات کاربر |
| PUT | `/api/auth/me` 🔒 | ویرایش پروفایل |

### منو و شعب
| متد | مسیر | توضیح |
|-----|------|--------|
| GET | `/api/menu/tabs` | تب‌های منو |
| GET | `/api/menu/items?tab=...` | آیتم‌های منو |
| GET | `/api/branches` | لیست شعب |
| GET | `/api/branches/{slug}` | جزئیات شعبه |
| GET | `/api/branches/{slug}/dishes` | غذاهای شعبه |
| GET | `/api/branches/{slug}/reviews` | نظرات شعبه |
| GET | `/api/search?q=...` | جستجو |

### سفارش و کاربر
| متد | مسیر | توضیح |
|-----|------|--------|
| GET/POST | `/api/addresses` 🔒 | آدرس‌ها |
| GET/POST | `/api/orders` 🔒 | سفارش‌ها |
| POST | `/api/orders/{id}/cancel` 🔒 | لغو سفارش |
| GET/POST | `/api/wishlist` 🔒 | علاقه‌مندی‌ها |
| POST | `/api/discount/apply` | اعمال کد تخفیف |
| POST | `/api/payment/confirm` 🔒 | تأیید پرداخت |

---

## تکنولوژی‌ها

**فرانت‌اند:** React ۱۹ · Vite ۸ · Tailwind CSS · React Router · Swiper · Neshan Maps  
**بک‌اند:** PHP ۸.۳ · MySQL · PDO · Bearer Token + OTP

---

## نکات مهم

1. پوشه‌های اجرایی همان `Front/Tarkhineh-Front` و `Back/tarkhineh-Back` هستند.
2. `node_modules` در ریپو نیست؛ با `npm install` نصب شود.
3. رمز دیتابیس را فقط محلی در `config/config.php` بگذارید.
4. OTP و درگاه پرداخت در حالت فعلی شبیه‌سازی شده‌اند (مناسب نمونه‌کار).
5. جزئیات بیشتر بک‌اند: `Back/tarkhineh-Back/README.md`

---

این پروژه برای نمونه‌کار و اهداف آموزشی آماده شده است.
