# ترخینه — سامانه سفارش آنلاین غذا

سایت مدرن سفارش آنلاین غذاهای ایرانی و خارجی، همراه با صفحات شعب رستوران، سبد خرید، پرداخت و پنل کاربری.

فرانت‌اند با **React + Vite + Tailwind** و بک‌اند با **PHP خام + MySQL** پیاده‌سازی شده است.

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
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vite.config.js
├── Back/
│   └── tarkhineh-Back/      # API با PHP خام
│       ├── index.php        # روتر اصلی
│       ├── config/          # تنظیمات و اتصال دیتابیس
│       ├── controllers/     # کنترلرها
│       ├── core/            # Auth, Request, Response
│       ├── database/        # schema.sql و seed
│       └── uploads/         # تصاویر منو و شعب
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

## راه‌اندازی بک‌اند (PHP + MySQL)

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

API روی این آدرس در دسترس است:

```text
http://localhost:8000/api/...
```

---

## راه‌اندازی فرانت‌اند (React)

```bash
cd Front/Tarkhineh-Front

npm install
npm run dev
```

معمولاً روی `http://localhost:5173` بالا می‌آید.

برای اتصال به API واقعی، در ریشه فرانت یک فایل `.env` بسازید:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### ساخت نسخه نهایی

```bash
npm run build
```

---

## API اصلی

همه پاسخ‌ها JSON هستند. مسیرهایی که با 🔒 مشخص شده‌اند نیاز به هدر زیر دارند:

```text
Authorization: Bearer <token>
```

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

**فرانت‌اند**
- React ۱۹
- Vite ۸
- Tailwind CSS ۳
- React Router ۷
- Swiper
- Neshan Maps (نقشه)
- React Icons

**بک‌اند**
- PHP ۸.۳ (بدون فریم‌ورک)
- MySQL / MariaDB
- PDO
- احراز هویت با Bearer Token + OTP

---

## نکات مهم

1. فولدر `node_modules` در ریپو نیست؛ با `npm install` نصب شود.
2. رمز دیتابیس را فقط در `config/config.php` محلی خودتان بگذارید و رمز واقعی را در گیت کامیت نکنید.
3. در محیط Production مقدار `APP_DEBUG` را `false` کنید و از HTTPS استفاده کنید.
4. ارسال SMS واقعی در `AuthController::sendOtp` هنوز پیاده‌سازی نشده و در حالت دیباگ کد OTP در پاسخ برمی‌گردد.
5. درگاه پرداخت به صورت شبیه‌سازی شده است و برای استفاده واقعی باید به درگاه بانکی وصل شود.

---

## مستندات بیشتر بک‌اند

جزئیات کامل‌تر API، ساختار جداول و نحوه اتصال فرانت به بک‌اند در این فایل آمده است:

`Back/tarkhineh-Back/README.md`

---

## مجوز

این پروژه برای اهداف آموزشی و نمونه‌کار ساخته شده است.
